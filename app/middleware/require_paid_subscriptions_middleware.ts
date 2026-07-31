import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequirePaidSubscriptionsMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, response } = ctx

    const user = auth.user!

    if (user.plan === 'free') {
      return response.forbidden({
        errors: [
          {
            message: 'This feature requires a paid subscription.',
            code: 'E_SUBSCRIPTION_REQUIRED',
          },
        ],
      })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
