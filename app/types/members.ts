import { AccessLevelType, RoleType } from '#enums/member'

export type PreviewUser = {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export type MemberResponse = {
  id: string
  role: RoleType
  accessLevel: AccessLevelType
  folderId: string
  user: PreviewUser
}
