import { type NotificationType } from '#enums/notification'

export interface NotificationActor {
  firstName: string
  lastName: string
  avatar: string | null
}

export interface NotificationFolder {
  folderName: string
  folderId: string
}

export interface NotificationItemResponse {
  id: string
  type: NotificationType
  createdAt: string
  actor: NotificationActor
  folder: NotificationFolder
  isRead: boolean
  title: string
  message: string
}

export interface NotificationMeta {
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

export interface ListNotificationsResponse {
  data: {
    notifications: NotificationItemResponse[]
    meta: NotificationMeta
  }
  success: boolean
  message: string
}

export interface NotificationSuccessResponse {
  data: {
    notification: NotificationItemResponse
  }
  success: true
  message: string
}
