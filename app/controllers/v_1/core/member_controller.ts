import type { HttpContext } from '@adonisjs/core/http'
import { FolderService } from '#services/folder_service'
import Member from '#models/member'
import MemberTransformer from '#transformers/member_transformer'
import { updateMemberValidator } from '#validators/member'
import { ApiSuccessResponse } from '#interfaces/api'
import { MemberListResponse, UpdateMemberResponse } from '#interfaces/members'
import { MemberService } from '#services/member_service'

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

    await MemberService.requireRoles(user.id, folderId, 'owner')

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
    const { params, response, auth } = ctx

    const folderId = params.folderId

    const initiator = auth.user!

    await MemberService.requireRoles(initiator.id, folderId, 'owner')

    await MemberService.destroyMember(folderId, params.memberId, initiator)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Member successfully removed from the folder.'
    )

    return response.ok(formattedResponse)
  }

  async leave(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    await MemberService.leaveFolder(folderId, user)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'You have successfully left the folder.'
    )

    return response.ok(formattedResponse)
  }
}
