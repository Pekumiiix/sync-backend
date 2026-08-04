import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { FolderService } from '#services/folder_service'
import { MemberService } from '#services/member_service'
import MemberTransformer from '#transformers/member_transformer'
import { updateMemberValidator } from '#validators/member'
import { type ApiSuccessResponse } from '#interfaces/api'
import { type MemberListResponse, type UpdateMemberResponse } from '#interfaces/members'

@inject()
export default class MembersController {
  constructor(
    protected folderService: FolderService,
    protected memberService: MemberService
  ) {}

  async index(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const user = auth.user!

    const { folder, permission } = await this.folderService.getFolderWithPermissions(
      params.folderId,
      user
    )

    const members = await this.memberService.getMembers(params.folderId)

    const formattedResponse: MemberListResponse = await ctx.serialize(
      {
        folder: {
          id: folder.id,
          name: folder.name,
        },
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

    const user = auth.user!

    const { accessLevel } = await request.validateUsing(updateMemberValidator)

    const member = await this.memberService.updateMemberAccess(
      params.folderId,
      params.memberId,
      user,
      accessLevel
    )

    const formattedResponse: UpdateMemberResponse = await ctx.serialize(
      { member: MemberTransformer.transform(member) },
      'Member permissions updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const initiator = auth.user!

    await this.memberService.requireRole(initiator.id, params.folderId, 'owner')
    await this.memberService.destroyMember(params.folderId, params.memberId, initiator)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Member successfully removed from the folder.'
    )

    return response.ok(formattedResponse)
  }

  async leave(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const user = auth.user!

    await this.memberService.leaveFolder(params.folderId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'You have successfully left the folder.'
    )

    return response.ok(formattedResponse)
  }
}
