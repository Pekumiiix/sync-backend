import db from '@adonisjs/lucid/services/db'
import Invitation from '#models/invitation'
import Member from '#models/member'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import { FolderService } from './folder_service.ts'
import { type StoreInvitationValidator } from '#validators/invitation'

export class InvitationService {
  static async getUserInvitations(user: User) {
    const baseQuery = Invitation.query()
      .where('email', user.email)
      .preload('inviter')
      .preload('folder')

    const [pendingInvitations, resolvedInvitations] = await Promise.all([
      baseQuery.clone().where('status', 'pending').orderBy('created_at', 'desc'),
      baseQuery.clone().whereNot('status', 'pending').orderBy('updated_at', 'desc'),
    ])

    return { pendingInvitations, resolvedInvitations }
  }

  static async createInvitation(inviterId: string, data: StoreInvitationValidator) {
    const existing = await Invitation.query()
      .where('email', data.email)
      .where('folder_id', data.folderId)
      .where('status', 'pending')
      .first()

    if (existing) {
      throw new Exception('A pending invitation already exists for this user.', { status: 400 })
    }

    return await Invitation.create({
      ...data,
      inviterId: inviterId,
      token: crypto.randomUUID(),
      expiresAt: DateTime.now().plus({ days: 7 }),
    })
  }

  static async sendInvitation(inviter: User, data: StoreInvitationValidator) {
    if (inviter.email === data.email) {
      throw new Exception('You cannot invite yourself to a folder.', { status: 400 })
    }

    const invitedUser = await User.findBy('email', data.email)

    if (!invitedUser) {
      throw new Exception('The user you are trying to invite does not exist.', { status: 404 })
    }

    const { folder, permission } = await FolderService.getFolderWithPermissions(
      data.folderId,
      inviter
    )

    if (permission.role !== 'owner') {
      throw new Exception('You do not have permission to invite users to this folder.', {
        status: 403,
      })
    }

    if (folder.isSystem) {
      throw new Exception('You cannot invite users to a system folder.', { status: 400 })
    }

    const existingMember = await invitedUser
      .related('memberships')
      .query()
      .where('folderId', folder.id)
      .first()

    if (existingMember) {
      throw new Exception('This user is already a member of this folder.', { status: 400 })
    }

    const invitation = await this.createInvitation(inviter.id, data)

    return invitation
  }

  static async acceptInvitation(token: string, user: User) {
    return await db.transaction(async (trx) => {
      const invitation = await Invitation.query({ client: trx })
        .where('token', token)
        .where('email', user.email)
        .preload('inviter')
        .preload('folder')
        .forUpdate()
        .firstOrFail()

      if (invitation.computedStatus !== 'pending') {
        throw new Exception('Invitation is no longer pending.', { status: 400 })
      }

      if (invitation.expiresAt < DateTime.now()) {
        throw new Exception('Invitation has expired.', { status: 400 })
      }

      const isAlreadyMember = await Member.query({ client: trx })
        .where('folder_id', invitation.folderId)
        .where('user_id', user.id)
        .first()

      if (isAlreadyMember) {
        throw new Exception('User is already a member of this folder.', { status: 400 })
      }

      invitation.useTransaction(trx)

      invitation.status = 'accepted'
      invitation.acceptedAt = DateTime.now()

      await invitation.save()

      const member = await Member.create(
        {
          folderId: invitation.folderId,
          userId: user.id,
          accessLevel: invitation.accessLevel,
          role: 'member',
        },
        { client: trx }
      )

      return { invitation, member }
    })
  }

  static async declineInvitation(token: string, user: User) {
    const invitation = await Invitation.query()
      .where('token', token)
      .where('email', user.email)
      .preload('inviter')
      .preload('folder')
      .first()

    if (!invitation) {
      throw new Exception('Invitation not found.', { status: 404 })
    }

    if (invitation.computedStatus !== 'pending') {
      throw new Exception('You can only decline pending invitations.', { status: 400 })
    }

    invitation.status = 'declined'

    await invitation.save()

    return invitation
  }
}
