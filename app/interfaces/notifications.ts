import type { Data } from '#client/data'

// Core models

interface NotificationMeta {
  unreadCount: number
  totalCount: number
  currentPage: number
}

export interface NotificationData {
  firstName: string
  lastName: string
  avatar: string | null

  folderName: string
  folderId: string

  targetName: string | null
}

// Response interfaces
export interface ListNotificationsResponse {
  data: {
    notifications: Data.Notification[]
    meta: NotificationMeta
  }
  success: boolean
  message: string
}

export interface NotificationSuccessResponse {
  data: {
    notification: Data.Notification
  }
  success: true
  message: string
}
