import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '#utils/string'
import UserTransformer from '#transformers/user_transformer'
import { events } from '#generated/events'
import { type AuthDataResponse } from '#interfaces/user'
import { inject } from '@adonisjs/core'
import { AccessTokenService } from '#services/access_token_service'

@inject()
export default class NewAccountController {
  constructor(protected accessTokenService: AccessTokenService) {}

  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const verificationToken = generateVerificationCode()
    const verificationExpiresAt = DateTime.now().plus({ hours: 12 })

    const user = await User.create({ firstName, lastName, email, password })

    user.emailVerificationToken = verificationToken
    user.emailVerificationTokenExpiresAt = verificationExpiresAt

    await user.save()

    const token = await this.accessTokenService.createAccessTokenForWebDashboard(user)

    events.UserRegistered.dispatch(user, verificationToken)

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
