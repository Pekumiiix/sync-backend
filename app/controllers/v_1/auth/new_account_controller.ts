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
import db from '@adonisjs/lucid/services/db'

@inject()
export default class NewAccountController {
  constructor(protected accessTokenService: AccessTokenService) {}

  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const verificationToken = generateVerificationCode()
    const verificationExpiresAt = DateTime.now().plus({ hours: 12 })

    const { user, token } = await db.transaction(async (trx) => {
      const createdUser = await User.create(
        { firstName, lastName, email, password },
        { client: trx }
      )

      createdUser.useTransaction(trx)

      createdUser.emailVerificationToken = verificationToken
      createdUser.emailVerificationTokenExpiresAt = verificationExpiresAt

      await createdUser.save()

      const createdToken =
        await this.accessTokenService.createAccessTokenForWebDashboard(createdUser)

      return {
        user: createdUser,
        token: createdToken,
      }
    })

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
