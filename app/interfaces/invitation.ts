export interface InviterPreview {
  id: string
  avatarUrl: string
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
  status: string
  inviter: InviterPreview
  folder: FolderPreview
}
