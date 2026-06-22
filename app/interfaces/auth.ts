export interface UserSettings {
  autoMergeDuplicate: boolean
  notifyOnNewMember: boolean
  notifyOnNewBookmark: boolean
  frequency: string
}

export interface UserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
  location: string
  avatarUrl: string
  plan: string
  createdAt: string
  updatedAt: string
  settings: UserSettings
}
