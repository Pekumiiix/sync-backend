import { AuthDataResponse } from '#interfaces/user'
import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show(ctx: HttpContext) {
    const { auth, response } = ctx

    const formattedUser: AuthDataResponse = ctx.serialize(
      { user: UserTransformer.transform(auth.getUserOrFail()) },
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

    const formattedResponse: AuthDataResponse = ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Profile updated successfully'
    )

    return response.ok(formattedResponse)
  }
}
