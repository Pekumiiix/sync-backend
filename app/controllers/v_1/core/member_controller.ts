import type { HttpContext } from '@adonisjs/core/http'
import { FolderService } from '#services/folder_service'
import Member from '#models/member'
import MemberTransformer from '#transformers/member_transformer'
import { updateMemberValidator } from '#validators/member'
import { apiError } from '#utils/response'
import { events } from '#generated/events'
import { ApiSuccessResponse } from '#interfaces/api'
import { MemberListResponse, UpdateMemberResponse } from '#interfaces/members'

export default class MembersController {
  async index(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    const members = await Member.query().where('folder_id', folder.id).preload('user')

    const formattedResponse: MemberListResponse = ctx.serialize(
      {
        members: MemberTransformer.transform(members),
        permission,
        meta: { totalMemberCount: folder.memberCount },
      },
      'Members fetched successfully!'
    )

    return response.ok(formattedResponse)
  }

  async update(ctx: HttpContext) {
    const { response, params, auth, request } = ctx

    const { accessLevel } = await request.validateUsing(updateMemberValidator)

    const folderId = params.folderId
    const memberId = params.memberId

    const user = auth.user!

    const { permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.role !== 'owner') {
      return response.forbidden(apiError('Only folder owners can update member permissions'))
    }

    const member = await Member.query()
      .where('id', memberId)
      .where('folder_id', folderId)
      .firstOrFail()

    member.accessLevel = accessLevel
    await member.save()

    const formattedResponse: UpdateMemberResponse = ctx.serialize(
      { member: MemberTransformer.transform(member) },
      'Member permissions updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId
    const memberId = params.memberId

    const user = auth.user!

    const { permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (memberId === user.id) {
      return response.forbidden(
        apiError(
          'You cannot remove yourself from the folder. Please use the leave endpoint instead.'
        )
      )
    }

    if (permission.role !== 'owner') {
      return response.forbidden(apiError('Only folder owners can remove members'))
    }

    const member = await Member.query()
      .where('id', memberId)
      .where('folder_id', folderId)
      .preload('user')
      .firstOrFail()

    await member.delete()

    events.MemberRemoved.dispatch(folderId, member.user.firstName, user)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Member removed successfully!'
    )

    return response.ok(formattedResponse)
  }

  async leave(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId
    const user = auth.user!

    const { permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.role === 'owner') {
      return response.forbidden(
        apiError('Folder owners cannot leave their own folder. Please delete the folder instead.')
      )
    }

    const member = await user
      .related('memberships')
      .query()
      .where('folder_id', folderId)
      .firstOrFail()

    await member.delete()

    events.MemberLeft.dispatch(folderId, user)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'You have successfully left the folder.'
    )

    return response.ok(formattedResponse)
  }
}
