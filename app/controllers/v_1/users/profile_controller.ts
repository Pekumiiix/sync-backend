import { SYNC_FREQUENCY_IN_HOURS } from '#enums/sync_frequency'
import { type ProfileResponse } from '#interfaces/profile'
import { type FrequencyHours } from '#interfaces/user'
import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator, updateSettingsValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
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

    const { firstName, lastName, avatarUrl, location } =
      await request.validateUsing(updateProfileValidator)

    const user = auth.user!

    user.merge({ firstName, lastName, avatarUrl, location })

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

    const frequncyInHours =
      SYNC_FREQUENCY_IN_HOURS[frequency ?? user.settings?.syncFrequencyInHours]

    user.merge({
      settings: {
        ...user.settings,
        syncFrequencyInHours: frequncyInHours as FrequencyHours,
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
}
