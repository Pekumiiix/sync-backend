import { type UserResponse } from './user.ts'

export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: UserResponse
  }
}
