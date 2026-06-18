import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import UserRegistered from '#events/user_registered'
import { generateVerificationCode } from '../utils/string.ts'
import UserTransformer from '#transformers/user_transformer'

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

    await UserRegistered.dispatch(user, verificationToken)

    const token = await User.accessTokens.create(user)

    const formattedResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Account created successfully!'
    )

    return response.created(formattedResponse)
  }
}
