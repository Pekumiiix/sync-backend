export interface ExtensionSignInResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      avatarUrl: string | null
    }
  }
}
