import { type ApiSuccessResponse } from '#interfaces/api'
import type {
  ListNotificationsResponse,
  NotificationSuccessResponse,
} from '#interfaces/notifications'
import { NotificationService } from '#services/notification_service'
import NotificationTransformer from '#transformers/notification_transformer'
import { notificationQueryParam } from '#validators/notification'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class NotificationsController {
  async index(ctx: HttpContext) {
    const { auth, response, request } = ctx

    const { page = 1, limit = 10 } = await request.validateUsing(notificationQueryParam, {
      data: request.qs(),
    })

    const user = auth.user!

    const { notifications, unreadCount, totalCount, currentPage } =
      await NotificationService.getUserNotifications(user, page, limit)

    const formattedResponse: ListNotificationsResponse = await ctx.serialize(
      {
        notifications: NotificationTransformer.transform(notifications.all()),
        meta: { unreadCount, totalCount, currentPage },
      },
      'Notifications retrieved.'
    )

    return response.ok(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const notificationId = params.notificationId

    const user = auth.user!

    const { notification } = await NotificationService.getNotification(notificationId, user)

    await notification.delete()

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(null, 'Notification deleted.')

    return response.ok(formattedResponse)
  }

  async destroyAll(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    await user.related('notifications').query().delete()

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'All notifications deleted.'
    )

    return response.ok(formattedResponse)
  }

  async markAsRead(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const notificationId = params.notificationId

    const user = auth.user!

    const { notification } = await NotificationService.getNotification(notificationId, user)

    notification.readAt = DateTime.now()

    await notification.save()

    const formattedResponse: NotificationSuccessResponse = await ctx.serialize(
      { notification },
      'Notification read.'
    )

    return response.ok(formattedResponse)
  }

  async markAsUnread(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const user = auth.user!

    const notificationId = params.notificationId

    const { notification } = await NotificationService.getNotification(notificationId, user)

    notification.readAt = null

    await notification.save()

    const formattedResponse: NotificationSuccessResponse = await ctx.serialize(
      { notification },
      'Notification marked as unread.'
    )

    return response.ok(formattedResponse)
  }

  async markAllAsRead(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    await user.related('notifications').query().update({ readAt: DateTime.now() })

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'All notifications marked as read.'
    )

    return response.ok(formattedResponse)
  }
}
