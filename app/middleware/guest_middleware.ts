import { apiError } from '#utils/response'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class GuestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const isAuthenticated = await ctx.auth.check()

    if (isAuthenticated) {
      return ctx.response.badRequest(apiError('You are already logged in.'))
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
