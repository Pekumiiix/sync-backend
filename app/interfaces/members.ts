import { type FolderPermission } from './folders.ts'
import type { Data } from '#client/data'

// Response interfaces
export interface MemberListResponse {
  data: {
    folder: { id: string; name: string }
    members: Data.Member[]
    permission: FolderPermission
    meta: { totalMemberCount: number }
  }
  success: boolean
  message: string
}

export interface UpdateMemberResponse {
  data: { member: Data.Member }
  success: boolean
  message: string
}
