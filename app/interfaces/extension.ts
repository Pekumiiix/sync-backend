import type { Data } from '#client/data'

// Response interfaces
export interface ExtensionSignInResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: Data.User
  }
}
