import { InvitationStatusType } from '#enums/invitation'

export interface InviterPreview {
  id: string
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export interface FolderPreview {
  id: string
  name: string
}

export interface InvitationResponse {
  id: string
  folderId: string
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
