export interface UserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isEmailVerified: boolean
  location: string | null
  avatarUrl: string | null
  plan: string
  integrations: string[]
  createdAt: string
  updatedAt: string
}

export interface AuthStoreData {
  user: UserResponse
  token: string
}
