export const NOTIFICATION_TYPES = [
  'member_joined',
  'member_left',
  'member_removed',
  'new_bookmark',
  'bookmark_updated',
  'bookmark_deleted',
] as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[number]
