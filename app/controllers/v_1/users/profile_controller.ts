import { AuthDataResponse } from '#interfaces/user'
import { BookmarkService } from '#services/bookmark_service'
import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    const browserTypes = await BookmarkService.getAllBrowserTypesForUser(user.id)

    const formattedUser: AuthDataResponse = ctx.serialize(
      { user: UserTransformer.transform(user), browserTypes },
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

    const browserTypes = await BookmarkService.getAllBrowserTypesForUser(user.id)

    const formattedResponse: AuthDataResponse = ctx.serialize(
      { user: UserTransformer.transform(user), browserTypes },
      'Profile updated successfully'
    )

    return response.ok(formattedResponse)
  }
}
