import { type AccessLevelType, type RoleType } from '#enums/member'
import { type FolderPermission } from './folders.ts'

export interface PreviewUser {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface MemberResponse {
  id: string
  role: RoleType
  accessLevel: AccessLevelType
  folderId: string
  user: PreviewUser
}

export interface MemberListResponse {
  data: {
    members: MemberResponse[]
    permission: FolderPermission
    meta: { totalMemberCount: number }
  }
  success: boolean
  message: string
}

export interface UpdateMemberResponse {
  data: { member: MemberResponse }
  success: boolean
  message: string
}
