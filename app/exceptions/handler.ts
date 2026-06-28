import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as vineErrors } from '@vinejs/vine'
import { errors as lucidErrors } from '@adonisjs/lucid'
import { errors as authErrors } from '@adonisjs/auth'
import { apiError } from '#utils/response'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    // 1. Handle Validation Errors (422)
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(422).send({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        data: null,
        errors: error.messages,
      })
    }

    // 2. Handle Database Row Not Found (404)
    if (error instanceof lucidErrors.E_ROW_NOT_FOUND) {
      return ctx.response.status(404).send(apiError('Resource not found.'))
    }

    // 3. Handle Unauthorized Access (401)
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
      return ctx.response
        .status(401)
        .send(apiError('Unauthorized access. Please log in to continue.'))
    }

    // 4. Handle Custom Service Exceptions (4xx Client Errors)
    const status = error.status || 500

    if (status >= 400 && status < 500) {
      return ctx.response.status(status).send(apiError(error.message))
    }

    // 5. The Fallback for System Crashes (500 Server Errors)
    const message = this.debug ? error.message : 'An unexpected server error occurred.'

    return ctx.response.status(status).send(apiError(message))
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
