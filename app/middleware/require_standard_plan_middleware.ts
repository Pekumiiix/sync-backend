import { apiError } from '#utils/response'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RequireStandardPlanMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, response } = ctx

    const user = auth.user!

    if (user.plan !== 'standard') {
      return response.forbidden(apiError('You need the "standard" plan to access this feature.'))
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
