import { NotificationType } from '#enums/notification'

export interface NotificationActor {
  actorName: string
  actorAvatar: string | null
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

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface INotificationMeta {
  unreadCount: number
  totalCount: number
  currentPage: number
}

export interface NotificationData {
  actorName: string
  actorAvatar: string | null

  folderName: string
  folderId: string

  targetName: string | null
}

export interface ListNotificationsResponse {
  data: {
    notifications: NotificationItemResponse[]
    meta: INotificationMeta
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
