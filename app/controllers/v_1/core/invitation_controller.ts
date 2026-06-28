import { storeInvitationValidator } from '#validators/invitation'
import { HttpContext } from '@adonisjs/core/http'
import { FolderService } from '#services/folder_service'
import { apiError } from '#utils/response'
import Invitation from '#models/invitation'
import User from '#models/user'
import InvitationTransformer from '#transformers/invitation_transformer'
import { events } from '#generated/events'
import { ApiSuccessResponse } from '#interfaces/api'
import { InvitationSuccessResponse, ListInvitationsResponse } from '#interfaces/invitations'
import { InvitationService } from '#services/invitation_service'

export default class InvitationsController {
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const baseQuery = Invitation.query()
      .where('email', user.email)
      .preload('inviter')
      .preload('folder')

    const [pendingInvitations, resolvedInvitations] = await Promise.all([
      baseQuery.clone().where('status', 'pending').orderBy('created_at', 'desc'),
      baseQuery.clone().whereNot('status', 'pending').orderBy('updated_at', 'desc'),
    ])

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

    if (user.email === email) {
      return response.badRequest(apiError('You cannot invite yourself to a folder.'))
    }

    const invitedUser = await User.findBy('email', email)

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (!invitedUser) {
      return response.notFound(apiError('The user you are trying to invite does not exist.'))
    }

    if (permission.role !== 'owner') {
      return response.forbidden(
        apiError('You do not have permission to invite users to this folder.')
      )
    }

    if (folder.isSystem) {
      return response.forbidden(apiError('You cannot invite users to a system folder.'))
    }

    await InvitationService.createInvitation({
      folderId,
      email,
      accessLevel,
      inviterId: user.id,
    })

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Invitation sent successfully.'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const invitationId = params.invitationId

    const user = auth.user!

    const invitation = await Invitation.query()
      .where('id', invitationId)
      .where('email', user.email)
      .first()

    if (!invitation) {
      return response.notFound(apiError('Invitation not found.'))
    }

    if (invitation.status !== 'pending') {
      return response.badRequest(apiError('You can only decline pending invitations.'))
    }

    invitation.status = 'declined'

    await invitation.save()

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
