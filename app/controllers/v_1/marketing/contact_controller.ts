import { type ApiSuccessResponse } from '#interfaces/api'
import ContactSubmission from '#models/contact_submission'
import env from '#start/env'
import { contactValidator } from '#validators/marketing'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class ContactController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const payload = await request.validateUsing(contactValidator)

    await ContactSubmission.create(payload)

    await mail.send((message) => {
      message
        .to('amaopelumi96@gmail.com')
        .from(env.get('MAIL_FROM_ADDRESS'))
        .replyTo(payload.email)
        .subject(`New Contact Inquiry from ${payload.company || payload.firstName}`)
        .htmlView('emails/contact_inquiry', { ...payload })
    })

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Your contact inquiry has been submitted successfully!'
    )

    return response.ok(formattedResponse)
  }
}
