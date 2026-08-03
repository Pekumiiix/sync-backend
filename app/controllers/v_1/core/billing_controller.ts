import User from '#models/user'
import env from '#start/env'
import { apiError } from '#utils/response'
import { billingValidator } from '#validators/billing'
import type { HttpContext } from '@adonisjs/core/http'
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

lemonSqueezySetup({
  apiKey: env.get('LEMON_SQUEEZY_API_KEY'),
})

export default class BillingController {
  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const user = auth.user!

    const { variantId } = await request.validateUsing(billingValidator)

    const { error, data } = await createCheckout(env.get('LEMON_SQUEEZY_STORE_ID'), variantId, {
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id.toString(),
        },
      },
      productOptions: {
        redirectUrl: `${env.get('FRONTEND_URL')}/app/all-bookmarks?billing=success`,
      },
    })

    if (error) {
      console.error('Error creating checkout session:', error)
      return response.internalServerError(apiError('Failed to create checkout session'))
    }

    const formatedResponse = await ctx.serialize(
      { url: data.data.attributes.url },
      'Checkout created successfully'
    )

    return response.ok(formatedResponse)
  }

  async webhook({ request, response }: HttpContext) {
    const signature = request.header('x-signature')
    const rawBody = request.raw()

    if (!signature || !rawBody) {
      return response.badRequest('Missing signature or payload')
    }

    const secret = env.get('LEMON_SQUEEZY_WEBHOOK_SECRET')
    const hmac = crypto.createHmac('sha256', secret)
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
    const signatureBuffer = Buffer.from(signature, 'utf8')

    if (
      digest.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(digest, signatureBuffer)
    ) {
      return response.unauthorized('Invalid webhook signature')
    }

    const event = request.body()
    const eventName = event.meta.event_name
    const customData = event.meta.custom_data

    if (!customData || !customData.user_id) {
      return response.badRequest('Missing user context in custom data')
    }

    const user = await User.findOrFail(customData.user_id)

    const eventUpdatedAt = DateTime.fromISO(event.data.attributes.updated_at)

    if (
      user.subscriptionUpdatedAt &&
      eventUpdatedAt.toMillis() <= user.subscriptionUpdatedAt.toMillis()
    ) {
      return response.ok({ received: true, message: 'Ignored duplicate or older webhook' })
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated':
        user.plan = event.data.attributes.variant_name.toLowerCase()
        user.subscriptionStatus = event.data.attributes.status
        break
      case 'subscription_cancelled':
      case 'subscription_expired':
        user.plan = 'free'
        user.subscriptionStatus = 'inactive'
        break
    }

    await user.save()

    return response.ok({ received: true })
  }
}
