import type { InvitationStatusType } from '#enums/invitation'

export interface InviterPreview {
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export interface FolderPreview {
  id: string
  name: string
  recentBookmarksImages: string[]
  isProtected: boolean
}

export interface InvitationResponse {
  id: string
  token: string
  createdAt: string
  status: InvitationStatusType
  inviter: InviterPreview
  folder: FolderPreview
}

export interface ListInvitationsResponse {
  data: { pendingInvitations: InvitationResponse[]; resolvedInvitations: InvitationResponse[] }
  success: boolean
  message: string
}

export interface InvitationSuccessResponse {
  data: { invitation: InvitationResponse }
  success: boolean
  message: string
}
