import { SYNC_FREQUENCY_IN_HOURS } from '#enums/sync_frequency'
import { ApiSuccessResponse } from '#interfaces/api'
import { type ProfileResponse } from '#interfaces/profile'
import { type FrequencyHours } from '#interfaces/user'
import User from '#models/user'
import { OAuthService } from '#services/o_auth_service'
import OAuthIdentityTransformer from '#transformers/o_auth_identity_transformer'
import UserTransformer from '#transformers/user_transformer'
import { apiError } from '#utils/response'
import { updateProfileValidator, updateSettingsValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ProfileController {
  constructor(protected oAuthService: OAuthService) {}

  async show(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    const formattedUser: ProfileResponse = await ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Profile retrieved successfully'
    )

    return response.ok(formattedUser)
  }

  async update(ctx: HttpContext) {
    const { auth, request, response } = ctx

    const { firstName, lastName, avatarUrl, location, password } =
      await request.validateUsing(updateProfileValidator)

    const user = auth.user!

    user.merge({ firstName, lastName, avatarUrl, location, password })

    await user.save()

    const formattedResponse: ProfileResponse = await ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Profile updated successfully'
    )

    return response.ok(formattedResponse)
  }

  async updateSettings(ctx: HttpContext) {
    const { auth, response, request } = ctx

    const validatedSettings = await request.validateUsing(updateSettingsValidator)

    const user = auth.user!

    const { frequency, ...data } = validatedSettings

    let frequencyInHours: number = user.settings.syncFrequencyInHours

    if (frequency) {
      frequencyInHours = SYNC_FREQUENCY_IN_HOURS[frequency]

      if (frequencyInHours === 0 && user.plan !== 'standard') {
        return response.badRequest(
          apiError('Sync frequency cannot be set to "off" for non-standard users.')
        )
      }

      if (frequencyInHours === 3 && user.plan === 'free') {
        return response.badRequest(
          apiError('Sync frequency cannot be set to "3 hours" for free users.')
        )
      }
    }

    user.merge({
      settings: {
        ...user.settings,
        syncFrequencyInHours: frequencyInHours as FrequencyHours,
        ...data,
      },
    })

    await user.save()

    const formattedResponse: ProfileResponse = await ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Settings updated successfully'
    )

    return response.ok(formattedResponse)
  }

  async ouaths(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    const oauths = await user.related('oauthIdentities').query()

    const formattedResponse: ProfileResponse = await ctx.serialize(
      { identities: OAuthIdentityTransformer.transform(oauths) },
      'OAuths retrieved successfully'
    )

    return response.ok(formattedResponse)
  }

  async deleteOAuth(ctx: HttpContext) {
    const { auth, response, params } = ctx

    const provider = params.provider

    const user = auth.user! as User

    await user.load('oauthIdentities')

    if (!user.password && user.oauthIdentities.length <= 1) {
      return response.badRequest(
        apiError(
          'Cannot disconnect account. No other authentication method available. Please set a password before disconnecting.'
        )
      )
    }

    await this.oAuthService.unlinkOAuthIdentity(user, provider)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'OAuth identity deleted successfully.'
    )

    return response.ok(formattedResponse)
  }
}
