import { type ApiSuccessResponse } from '#interfaces/api'
import SendContactEmailJob from '#jobs/send_contact_email_job'
import ContactSubmission from '#models/contact_submission'
import { contactValidator } from '#validators/marketing'
import type { HttpContext } from '@adonisjs/core/http'
import queue from '@rlanz/bull-queue/services/main'

export default class ContactController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const payload = await request.validateUsing(contactValidator)

    await ContactSubmission.create(payload)

    await queue.dispatch(SendContactEmailJob, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    })

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Your contact inquiry has been submitted successfully!'
    )

    return response.ok(formattedResponse)
  }
}
