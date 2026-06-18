import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show( ctx : HttpContext) {
    const { auth } = ctx;

    return ctx.serialize(UserTransformer.transform(auth.getUserOrFail()))
  }
}
