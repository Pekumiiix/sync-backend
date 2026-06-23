import { NotificationType } from '#enums/notification'

export type NotificationActor = {
  actorName: string
  actorAvatar: string | null
}

export type NotificationFolder = {
  folderName: string
  folderId: string
}

export type NotificationItemResponse = {
  id: string
  type: NotificationType
  createdAt: string
  actor: NotificationActor
  folder: NotificationFolder
  isRead: boolean
  title: string
  message: string
}

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export type NotificationData = {
  actorName: string
  actorAvatar: string | null
  folderName: string
  folderId: string
}
