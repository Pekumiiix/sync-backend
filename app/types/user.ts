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
  location: string | null
  avatarUrl: string | null
  plan: string
  createdAt: string
  updatedAt: string
  settings: UserSettings
}

export interface CreateAccountResponse {
  success: boolean
  message: string
  data: {
    user: UserResponse
    token: string
  }
}
