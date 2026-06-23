import { storeInvitationValidator } from '#validators/invitation'
import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '#services/folder_service'
import { apiError } from '#utils/response'
import Invitation from '#models/invitation'
import crypto from 'node:crypto'
import User from '#models/user'
import InvitationTransformer from '#transformers/invitation_transformer'
import { DateTime } from 'luxon'
import Member from '#models/member'

export default class InvitationsController {
  /**
   * @index
   * @operationId getReceivedInvitations
   * @summary Get received invitations
   * @description Fetches all pending folder invitations sent to the authenticated user's email address, ordered by newest first.
   * @responseBody 200 - { "success": true, "message": "Invitations retrieved successfully.", "data": { "pendingInvitations": "<InvitationResponse[]>", "resolvedInvitations": "<InvitationResponse[]>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const invitations = await Invitation.query()
      .where('email', user.email)
      .where('status', 'pending')
      .preload('inviter')
      .preload('folder')
      .orderBy('createdAt', 'desc')

    const resolvedInvitations = await Invitation.query()
      .where('email', user.email)
      .whereNot('status', 'pending')
      .preload('inviter')
      .preload('folder')
      .orderBy('updatedAt', 'desc')

    const formattedResponse = ctx.serialize(
      {
        pendingInvitations: InvitationTransformer.transform(invitations),
        resolvedInvitations: InvitationTransformer.transform(resolvedInvitations),
      },
      'Invitations retrieved successfully.'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @store
   * @operationId sendInvitation
   * @summary Send a folder invitation
   * @description Creates a pending invitation for a user to join a folder. The sender must be the folder owner.
   * @requestBody <storeInvitationValidator>
   * @responseBody 201 - { "success": true, "message": "Invitation sent successfully.", "data": "null" }
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const { folderId, email, access_level } = await request.validateUsing(storeInvitationValidator)

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

    await Invitation.create({
      folderId,
      email,
      accessLevel: access_level,
      inviterId: user.id,
      token: crypto.randomUUID(),
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    const formattedResponse = ctx.serialize(null, 'Invitation sent successfully.')

    return response.created(formattedResponse)
  }

  /**
   * @destroy
   * @operationId declineInvitation
   * @summary Decline an invitation
   * @description Marks a pending invitation as declined. The authenticated user must be the recipient of the invite.
   * @paramPath invitationId - string - Required. The UUID of the invitation.
   * @responseBody 200 - { "success": true, "message": "Invitation declined successfully.", "data": { "invitation": "<InvitationResponse>" } }
   * @responseBody 400 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
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

    const formattedResponse = ctx.serialize(
      { invitation: transformedInvitation },
      'Invitation declined successfully.'
    )

    response.ok(formattedResponse)
  }

  /**
   * @accept
   * @operationId acceptInvitation
   * @summary Accept an invitation
   * @description Accepts a pending invitation and adds the user to the folder members.
   * @paramPath invitationId - string - Required. The UUID of the invitation.
   * @responseBody 200 - { "success": true, "message": "Invitation accepted successfully.", "data": { "invitation": "<InvitationResponse>" } }
   * @responseBody 400 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async accept(ctx: HttpContext) {
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
      return response.badRequest(apiError('You can only accept pending invitations.'))
    }

    invitation.status = 'accepted'
    invitation.acceptedAt = DateTime.now()

    await invitation.save()

    await Member.create({
      folderId: invitation.folderId,
      userId: user.id,
      accessLevel: invitation.accessLevel,
      role: 'member',
    })

    const transformedInvitation = InvitationTransformer.transform(invitation)

    const formattedResponse = ctx.serialize(
      { invitation: transformedInvitation },
      'Invitation accepted successfully.'
    )

    response.ok(formattedResponse)
  }
}
