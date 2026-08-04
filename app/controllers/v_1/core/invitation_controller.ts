import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { acceptInvitationValidator, storeInvitationValidator } from '#validators/invitation'
import InvitationTransformer from '#transformers/invitation_transformer'
import { events } from '#generated/events'
import type { InvitationSuccessResponse, ListInvitationsResponse } from '#interfaces/invitations'
import { InvitationService } from '#services/invitation_service'

@inject()
export default class InvitationsController {
  constructor(protected invitationService: InvitationService) {}

  async index(ctx: HttpContext) {
    const { response, auth } = ctx
    const user = auth.user!

    const { pendingInvitations, resolvedInvitations } =
      await this.invitationService.getUserInvitations(user)

    const formattedResponse: ListInvitationsResponse = await ctx.serialize(
      {
        pendingInvitations: InvitationTransformer.transform(pendingInvitations),
        resolvedInvitations: InvitationTransformer.transform(resolvedInvitations),
      },
      'Invitations retrieved successfully.'
    )

    return response.ok(formattedResponse)
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const user = auth.user!

    const data = await request.validateUsing(storeInvitationValidator)
    const invitation = await this.invitationService.sendInvitation(user, data)

    const formattedResponse: InvitationSuccessResponse = await ctx.serialize(
      { invitation: InvitationTransformer.transform(invitation) },
      'Invitation sent successfully.'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const user = auth.user!

    const invitation = await this.invitationService.declineInvitation(params.token, user)

    const formattedResponse: InvitationSuccessResponse = await ctx.serialize(
      { invitation: InvitationTransformer.transform(invitation) },
      'Invitation declined successfully.'
    )

    return response.ok(formattedResponse)
  }

  async accept(ctx: HttpContext) {
    const { params, request, response, auth } = ctx

    const user = auth.user!

    const { password } = await request.validateUsing(acceptInvitationValidator)

    const { invitation } = await this.invitationService.acceptInvitation(
      params.token,
      user,
      password
    )

    events.MemberJoined.dispatch(invitation.folderId, user)

    const formattedResponse: InvitationSuccessResponse = await ctx.serialize(
      { invitation: InvitationTransformer.transform(invitation) },
      'Invitation accepted successfully.'
    )

    return response.ok(formattedResponse)
  }
}
