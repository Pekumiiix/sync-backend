import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '#utils/string'
import UserTransformer from '#transformers/user_transformer'
import { events } from '#generated/events'
import { type AuthDataResponse } from '#interfaces/user'

export default class NewAccountController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ firstName, lastName, email, password })

    const verificationToken = generateVerificationCode()

    const verificationExpiresAt = DateTime.now().plus({ hours: 12 })

    user.emailVerificationToken = verificationToken
    user.emailVerificationTokenExpiresAt = verificationExpiresAt

    await user.save()

    events.UserRegistered.dispatch(user, verificationToken)

    const token = await User.accessTokens.create(user)

    const formattedResponse: AuthDataResponse = await ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Account created successfully!'
    )

    return response.created(formattedResponse)
  }
}
