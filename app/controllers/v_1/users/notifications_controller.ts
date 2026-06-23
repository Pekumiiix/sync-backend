import NotificationService from '#services/notification_service'
import NotificationTransformer from '#transformers/notification_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class NotificationsController {
  /**
   * @index
   * @operationId getNotifications
   * @summary Retrieve user notifications
   * @description Fetches a paginated list of notifications for the authenticated user sorted by newest first.
   * @paramQuery page - The page number to retrieve - @type(number)
   * @paramQuery limit - The number of notifications per page - @type(number)
   * @responseBody 200 - { "success": "boolean", "message": "string", "data": { "notifications": "<NotificationItemResponse[]>", "meta": "<PaginationMeta>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async index(ctx: HttpContext) {
    const { auth, response, request } = ctx

    const qs = request.qs()

    const page = qs.page ? Math.max(1, parseInt(qs.page, 10)) : 1
    const limit = qs.limit ? Math.max(1, parseInt(qs.limit, 10)) : 10

    const user = auth.user!

    const { notifications, unreadCount, totalCount, currentPage } =
      await NotificationService.getUserNotifications(user, page, limit)

    const formattedResponse = ctx.serialize(
      {
        notifications: NotificationTransformer.transform(notifications),
        meta: { unreadCount, totalCount, currentPage },
      },
      'Notifications retrieved.'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @destroy
   * @operationId deleteNotification
   * @summary Delete a user notification
   * @description Deletes a specific notification for the authenticated user.
   * @paramPath notificationId - The ID of the notification to delete - @type(string)
   * @responseBody 200 - { "success": "boolean", "message": "string", "data": "null" }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const notificationId = params.notificationId

    const user = auth.user!

    const { notification } = await NotificationService.getNotification(notificationId, user)

    await notification.delete()

    const formattedResponse = ctx.serialize(null, 'Notification deleted.')

    return response.ok(formattedResponse)
  }

  /**
   * @markAsRead
   * @operationId markNotificationAsRead
   * @summary Mark a notification as read
   * @description Marks a specific notification as read for the authenticated user.
   * @paramPath notificationId - The ID of the notification to mark as read - @type(string)
   * @responseBody 200 - { "success": "boolean", "message": "string", "data": { "notification": "<NotificationItemResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async markAsRead(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const notificationId = params.notificationId

    const user = auth.user!

    const { notification } = await NotificationService.getNotification(notificationId, user)

    notification.readAt = DateTime.now()

    await notification.save()

    const formattedResponse = ctx.serialize({ notification }, 'Notification read.')

    return response.ok(formattedResponse)
  }

  /**
   * @markAsUnread
   * @operationId markNotificationAsUnread
   * @summary Mark a notification as unread
   * @description Marks a specific notification as unread for the authenticated user.
   * @paramPath notificationId - The ID of the notification to mark as unread - @type(string)
   * @responseBody 200 - { "success": "boolean", "message": "string", "data": { "notification": "<NotificationItemResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async markAsUnread(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const user = auth.user!

    const notificationId = params.notificationId

    const { notification } = await NotificationService.getNotification(notificationId, user)

    notification.readAt = null

    await notification.save()

    const formattedResponse = ctx.serialize({ notification }, 'Notification marked as unread.')

    return response.ok(formattedResponse)
  }

  /**
   * @markAllAsRead
   * @operationId markAllNotificationsAsRead
   * @summary Mark all notifications as read
   * @description Marks all notifications for the authenticated user as read.
   * @responseBody 200 - { "success": "boolean", "message": "string", "data": { "notifications": "<NotificationItemResponse[]>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async markAllAsRead(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    await user.related('notifications').query().update({ readAt: DateTime.now() })

    const formattedResponse = ctx.serialize(null, 'All notifications marked as read.')

    return response.ok(formattedResponse)
  }
}
