import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '../sevices/folder_service.ts'
import Member from '#models/member'
import MemberTransformer from '#transformers/member_transformer'
import { updateMemberValidator } from '#validators/member'
import { apiError } from '../utils/response.ts'

export default class MembersController {
  /**
   * @index
   * @operationId getFolderMembers
   * @summary List all folder members
   * @description Fetches all members of a specific folder, including preloaded user profiles, alongside the current user's permission level.
   * @paramPath folderId - string - Required. The UUID of the specific folder.
   * @responseBody 200 - { "success": true, "message": "Members fetched successfully!", "data": { "members": "<MemberResponse[]>", "permission": "<FolderPermission>", "meta": { "totalMemberCount": 99 } } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async index(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    const members = await Member.query().where('folder_id', folder.id).preload('user')

    const formattedResponse = ctx.serialize(
      {
        members: MemberTransformer.transform(members),
        permission,
        meta: { totalMemberCount: folder.memberCount },
      },
      'Members fetched successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @update
   * @operationId updateFolderMember
   * @summary Update member role
   * @description Updates the access level (e.g., viewer or editor) of a specific member within a folder. The authenticated user must be the 'owner' of the folder.
   * @paramPath folderId - string - Required. The UUID of the specific folder.
   * @paramPath memberId - string - Required. The UUID of the member record to update.
   * @requestBody <updateMemberValidator>
   * @responseBody 200 - { "success": true, "message": "Member permissions updated successfully!", "data": "<MemberResponse>" }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
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
      .where('folderId', folderId)
      .firstOrFail()

    member.accessLevel = accessLevel
    await member.save()

    const formattedResponse = ctx.serialize(
      { member: MemberTransformer.transform(member) },
      'Member permissions updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @destroy
   * @operationId removeFolderMember
   * @summary Remove a member
   * @description Kicks a specific member out of a folder. The authenticated user making the request must be the 'owner' of the folder.
   * @paramPath folderId - string - Required. The UUID of the specific folder.
   * @paramPath memberId - string - Required. The UUID of the member record to remove.
   * @responseBody 200 - { "success": true, "message": "Member removed successfully!", "data": "null" }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { response, params, auth } = ctx

    const folderId = params.folderId
    const memberId = params.memberId

    const user = auth.user!

    const { permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.role !== 'owner') {
      return response.forbidden(apiError('Only folder owners can remove members'))
    }

    const member = await Member.query()
      .where('id', memberId)
      .where('folderId', folderId)
      .firstOrFail()

    await member.delete()

    const formattedResponse = ctx.serialize(null, 'Member removed successfully!')

    return response.ok(formattedResponse)
  }
}
