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

    const [pendingInvitations, resolvedInvitations] = await Promise.all([
      Invitation.query()
        .where('email', user.email)
        .where('status', 'pending')
        .preload('inviter')
        .preload('folder')
        .orderBy('created_at', 'desc'),
      Invitation.query()
        .where('email', user.email)
        .whereNot('status', 'pending')
        .preload('inviter')
        .preload('folder')
        .orderBy('updated_at', 'desc'),
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

    try {
      const { invitation } = await InvitationService.acceptInvitation(params.invitationId, user)

      events.MemberJoined.dispatch(invitation.folderId, user)

      return response.ok({
        message: 'Invitation accepted successfully.',
        invitation: InvitationTransformer.transform(invitation),
      })
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
        const err = error as { status: number; message: string }

        if (err.status === 400 || err.status === 404) {
          return response.status(err.status).send(apiError(err.message))
        }
      }

      return response.internalServerError(apiError('Failed to accept invitation.'))
    }
  }
}
