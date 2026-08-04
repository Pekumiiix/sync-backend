import type User from '#models/user'
import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import logger from '@adonisjs/core/services/logger'
import { cancelSubscription, createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { DateTime } from 'luxon'

export class BillingService {
  async createCheckoutSession(user: User, variantId: string) {
    const { error, data } = await createCheckout(env.get('LEMON_SQUEEZY_STORE_ID'), variantId, {
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id,
        },
      },
      productOptions: {
        redirectUrl: `${env.get('FRONTEND_URL')}/app/all-bookmarks?billing=success`,
      },
    })

    if (error) {
      logger.error({ userId: user.id, variantId, error }, 'Failed to create checkout session')
      throw new Exception('Checkout service temporarily unavailable', {
        status: 500,
        code: 'E_CHECKOUT_FAILED',
      })
    }

    return { url: data.data.attributes.url }
  }

  async cancelSubscription(user: User) {
    if (!user.subscriptionId) {
      throw new Exception('No active subscription found', {
        status: 400,
        code: 'E_NO_ACTIVE_SUBSCRIPTION',
      })
    }

    const { error, data } = await cancelSubscription(user.subscriptionId)

    if (error) {
      logger.error({ userId: user.id, error }, 'Failed to cancel subscription')
      throw new Exception('Failed to cancel subscription. Please contact support.', {
        status: 500,
        code: 'E_CANCEL_FAILED',
      })
    }

    const endsAtIso = data.data.attributes.ends_at

    if (endsAtIso) {
      const endsAt = DateTime.fromISO(endsAtIso)
      user.subscriptionExpiresAt = endsAt
    }

    user.subscriptionStatus = 'cancelled'

    await user.save()
  }
}
