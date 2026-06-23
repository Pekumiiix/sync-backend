import { InvitationStatusType } from '#enums/invitation'

export type InviterPreview = {
  id: string
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export type FolderPreview = {
  id: string
  name: string
}

export type InvitationResponse = {
  id: string
  folderId: string
  token: string
  createdAt: string
  status: InvitationStatusType
  inviter: InviterPreview
  folder: FolderPreview
}
