export interface UserSettings {
  autoMergeDuplicate: boolean
  notifyOnNewMember: boolean
  notifyOnNewBookmark: boolean
  frequency: string
}

export interface UserSettingsResponse {
  autoMergeDuplicate: boolean
  notification: {
    notifyOnNewMember: boolean
    notifyOnNewBookmark: boolean
  }
  sync: {
    frequency: string
  }
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
  settings: UserSettingsResponse
}

export interface AuthData {
  user: UserResponse
  token: string
}

export interface AuthDataResponse {
  success: boolean
  message: string
  data: AuthData
}
