import { storeInvitationValidator } from '#validators/invitation'
import { HttpContext } from '@adonisjs/core/http'
import InvitationTransformer from '#transformers/invitation_transformer'
import { events } from '#generated/events'
import { InvitationSuccessResponse, ListInvitationsResponse } from '#interfaces/invitations'
import { InvitationService } from '#services/invitation_service'

export default class InvitationsController {
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const { pendingInvitations, resolvedInvitations } =
      await InvitationService.getUserInvitations(user)

    const formattedResponse: ListInvitationsResponse = ctx.serialize(
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

    const { folderId, email, accessLevel } = await request.validateUsing(storeInvitationValidator)

    const user = auth.user!

    const invitation = await InvitationService.sendInvitation(user, {
      folderId,
      email,
      accessLevel,
    })

    const formattedResponse: InvitationSuccessResponse = ctx.serialize(
      { invitation: InvitationTransformer.transform(invitation) },
      'Invitation sent successfully.'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const invitationId = params.invitationId

    const user = auth.user!

    const invitation = await InvitationService.declineInvitation(invitationId, user)

    const transformedInvitation = InvitationTransformer.transform(invitation)

    const formattedResponse: InvitationSuccessResponse = ctx.serialize(
      { invitation: transformedInvitation },
      'Invitation declined successfully.'
    )

    return response.ok(formattedResponse)
  }

  async accept(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const user = auth.user!

    const { invitation } = await InvitationService.acceptInvitation(params.invitationId, user)

    events.MemberJoined.dispatch(invitation.folderId, user)

    const formattedResponse: InvitationSuccessResponse = ctx.serialize(
      { invitation: InvitationTransformer.transform(invitation) },
      'Invitation accepted successfully.'
    )

    return response.ok(formattedResponse)
  }
}
