import User from '#models/user'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import UserRegistered from '#events/user_registered'
import { generateVerificationCode } from '../utils/string.ts'
import UserTransformer from '#transformers/user_transformer'

export default class NewAccountController {
  /**
   * @store
   * @operationId createAccount
   * @summary Create a new user account
   * @description Registers a new user and returns an access token.
   * @requestBody <signupValidator>
   * @responseBody 201 - { "success": true, "message": "Account created successfully!", "data": { "user": { "id": "123e4567-e89b-12d3-a456-426614174000", "firstName": "John", "lastName": "Doe", "email": "john@example.com", "is_email_verified": false, "location": "", "avatar_url": "", "created_at": "2024-01-01T00:00:00.000Z", "updated_at": "2024-01-01T00:00:00.000Z", "plan": "free", "integrations": [] }, "token": "oat_MTAx.XYZ..." } }
   * @responseBody 422 - { "errors": [{ "message": "The email has already been taken", "rule": "database.unique", "field": "email" }] }
   */
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { firstName, lastName, email, password } = await request.validateUsing(signupValidator)

    const user = await User.create({ firstName, lastName, email, password })

    const verificationToken = generateVerificationCode()

    const verificationExpiresAt = DateTime.now().plus({ hours: 12 })

    user.emailVerificationToken = verificationToken
    user.emailVerificationTokenExpiresAt = verificationExpiresAt

    await user.save()

    UserRegistered.dispatch(user, verificationToken)

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
