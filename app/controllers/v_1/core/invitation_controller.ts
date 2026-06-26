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
import Folder from '#models/folder'
import db from '@adonisjs/lucid/services/db'
import { events } from '#generated/events'
import { ApiSuccessResponse } from '#interfaces/api'
import { InvitationSuccessResponse, ListInvitationsResponse } from '#interfaces/invitations'

export default class InvitationsController {
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

    const formattedResponse: ListInvitationsResponse = ctx.serialize(
      {
        pendingInvitations: InvitationTransformer.transform(invitations),
        resolvedInvitations: InvitationTransformer.transform(resolvedInvitations),
      },
      'Invitations retrieved successfully.'
    )

    return response.ok(formattedResponse)
  }

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

    response.ok(formattedResponse)
  }

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

    const folder = await Folder.query().where('id', invitation.folderId).first()

    if (!folder) {
      return response.notFound(
        apiError('The folder associated with this invitation does not exist.')
      )
    }

    const trx = await db.transaction()

    try {
      invitation.useTransaction(trx)

      invitation.status = 'accepted'
      invitation.acceptedAt = DateTime.now()

      await invitation.save()

      await Member.create({
        folderId: invitation.folderId,
        userId: user.id,
        accessLevel: invitation.accessLevel,
        role: 'member',
      })

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.internalServerError(
        apiError('An error occurred while accepting the invitation.')
      )
    }

    events.MemberJoined.dispatch(folder.id, user)

    const transformedInvitation = InvitationTransformer.transform(invitation)

    const formattedResponse: InvitationSuccessResponse = ctx.serialize(
      { invitation: transformedInvitation },
      'Invitation accepted successfully.'
    )

    response.ok(formattedResponse)
  }
}
