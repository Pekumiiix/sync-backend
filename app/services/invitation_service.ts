import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

import Invitation from '#models/invitation'
import Member from '#models/member'
import User from '#models/user'
import { FolderService } from './folder_service.ts'
import { MemberService } from './member_service.ts'
import { type StoreInvitationValidator } from '#validators/invitation'

@inject()
export class InvitationService {
  constructor(
    protected folderService: FolderService,
    protected memberService: MemberService
  ) {}

  async getUserInvitations(user: User) {
    const baseQuery = Invitation.query()
      .where('email', user.email)
      .preload('inviter', (query) => query.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (query) => query.select('name', 'password'))

    const [pendingInvitations, resolvedInvitations] = await Promise.all([
      baseQuery.clone().where('status', 'pending').orderBy('created_at', 'desc'),
      baseQuery.clone().whereNot('status', 'pending').orderBy('updated_at', 'desc'),
    ])

    return { pendingInvitations, resolvedInvitations }
  }

  async createInvitation(inviterId: string, data: StoreInvitationValidator) {
    const existing = await Invitation.query()
      .where('email', data.email)
      .where('folder_id', data.folderId)
      .where('status', 'pending')
      .first()

    if (existing) {
      throw new Exception('A pending invitation already exists for this user.', { status: 400 })
    }

    const invitation = await Invitation.create({
      ...data,
      inviterId: inviterId,
      token: crypto.randomUUID(),
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    await invitation.load('folder', (query) =>
      query.select('name', 'password', 'recent_bookmarks_images')
    )

    return invitation
  }

  async sendInvitation(inviter: User, data: StoreInvitationValidator) {
    if (inviter.email === data.email) {
      throw new Exception('You cannot invite yourself to a folder.', { status: 400 })
    }

    const [invitedUser, { folder, permission }] = await Promise.all([
      User.findBy('email', data.email),
      this.folderService.getFolderWithPermissions(data.folderId, inviter),
    ])

    if (!invitedUser) {
      throw new Exception('The user you are trying to invite does not exist.', { status: 404 })
    }

    if (permission.role !== 'owner') {
      throw new Exception('You do not have permission to invite users to this folder.', {
        status: 403,
      })
    }

    if (folder.isSystem) {
      throw new Exception('You cannot invite users to a system folder.', { status: 400 })
    }

    const existingMember = await this.memberService.checkMembership(data.folderId, invitedUser.id)

    if (existingMember) {
      throw new Exception('This user is already a member of this folder.', { status: 400 })
    }

    return this.createInvitation(inviter.id, data)
  }

  async acceptInvitation(token: string, user: User, password?: string) {
    return await db.transaction(async (trx) => {
      const invitation = await Invitation.query({ client: trx })
        .where('token', token)
        .where('email', user.email)
        .preload('inviter', (query) => query.select('first_name', 'last_name', 'avatar_url'))
        .preload('folder', (query) => query.select('name', 'password'))
        .forUpdate()
        .firstOrFail()

      if (invitation.computedStatus !== 'pending') {
        throw new Exception('Invitation is no longer pending.', { status: 400 })
      }

      if (invitation.expiresAt < DateTime.now()) {
        throw new Exception('Invitation has expired.', { status: 400 })
      }

      if (invitation.folder.password !== null) {
        if (user.plan === 'free') {
          throw new Exception('This feature requires a paid subscription.', { status: 403 })
        }

        const isPasswordValid = await hash.verify(invitation.folder.password, password || '')

        if (!isPasswordValid) {
          throw new Exception('Invalid password provided for this folder.', { status: 403 })
        }
      }

      const isAlreadyMember = await this.memberService.checkMembership(
        invitation.folderId,
        user.id,
        trx
      )

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

  async declineInvitation(token: string, user: User) {
    const invitation = await Invitation.query()
      .where('token', token)
      .where('email', user.email)
      .preload('inviter', (query) => query.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (query) => query.select('name', 'password'))
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
