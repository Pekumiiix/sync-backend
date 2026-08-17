import { PLAN_NAME_CONFIG } from '#enums/plan_name'
import { type ApiSuccessResponse } from '#interfaces/api'
import { type CreateCheckoutResponse } from '#interfaces/billing'
import User from '#models/user'
import { BillingService } from '#services/billing_service'
import env from '#start/env'
import { billingValidator } from '#validators/billing'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

@inject()
export default class BillingController {
  constructor(protected billingService: BillingService) {}

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const user = auth.user!

    const { variantId } = await request.validateUsing(billingValidator)

    const { url } = await this.billingService.createCheckoutSession(user, variantId)

    const formatedResponse: CreateCheckoutResponse = await ctx.serialize(
      { url },
      'Checkout created successfully'
    )

    return response.ok(formatedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    await this.billingService.cancelSubscription(user)

    const formatedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Subscription cancelled successfully'
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
        user.subscriptionId = event.data.id
        user.plan = PLAN_NAME_CONFIG[event.data.attributes.variant_name]
        user.subscriptionStatus = event.data.attributes.status
        break
      case 'subscription_updated':
        user.plan = PLAN_NAME_CONFIG[event.data.attributes.variant_name]
        user.subscriptionStatus = event.data.attributes.status
        break
      case 'subscription_cancelled':
        user.subscriptionStatus = 'cancelled'

        const endsAt = event.data.attributes.ends_at

        if (endsAt) {
          user.subscriptionExpiresAt = DateTime.fromISO(endsAt)
        }
        break
      case 'subscription_expired':
        user.plan = 'free'
        user.subscriptionStatus = 'expired'
        user.subscriptionExpiresAt = null
        break
    }

    await user.save()

    return response.ok({ received: true })
  }
}
