import type { Data } from '#client/data'

export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: Data.User
  }
}
