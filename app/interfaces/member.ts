interface PreviewUser {
  firstName: string
  lastName: string
  avatarUrl: string
}

export interface MemberResponse {
  id: string
  role: string
  accessLevel: string
  folderId: string
  user: PreviewUser
}
