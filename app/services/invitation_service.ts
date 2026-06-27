// app/services/invitation_service.ts
import db from '@adonisjs/lucid/services/db'
import Invitation from '#models/invitation'
import Member from '#models/member'
import { DateTime } from 'luxon'
import { Exception } from '@adonisjs/core/exceptions'
import User from '#models/user'
import { AccessLevelType } from '#enums/member'

export class InvitationService {
  static async createInvitation(data: {
    folderId: string
    email: string
    accessLevel: AccessLevelType
    inviterId: string
  }) {
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
      token: crypto.randomUUID(),
      expiresAt: DateTime.now().plus({ days: 7 }),
    })
  }

  static async acceptInvitation(invitationId: number, user: User) {
    return await db.transaction(async (trx) => {
      const invitation = await Invitation.query({ client: trx })
        .where('id', invitationId)
        .where('email', user.email)
        .forUpdate()
        .firstOrFail()

      if (invitation.status !== 'pending') {
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
}
