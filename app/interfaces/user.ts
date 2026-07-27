import type { Data } from '#client/data'

export type FrequencyHours = 0 | 3 | 6 | 12

export interface UserSettingsSchema {
  autoMergeDuplicate: boolean
  notifyOnNewMember: boolean
  notifyOnNewBookmark: boolean
  syncFrequencyInHours: FrequencyHours
}

export interface AuthData {
  user: Data.User
  token: string
}

export interface AuthDataResponse {
  success: boolean
  message: string
  data: AuthData
}
