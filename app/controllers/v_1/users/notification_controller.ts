import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { type ApiSuccessResponse } from '#interfaces/api'
import type {
  ListNotificationsResponse,
  NotificationSuccessResponse,
} from '#interfaces/notifications'
import { NotificationService } from '#services/notification_service'
import NotificationTransformer from '#transformers/notification_transformer'
import { notificationQueryParam } from '#validators/notification'

@inject()
export default class NotificationsController {
  constructor(protected notificationService: NotificationService) {}

  async index(ctx: HttpContext) {
    const { auth, response, request } = ctx

    const user = auth.user!

    const { page = 1, limit = 10 } = await request.validateUsing(notificationQueryParam, {
      data: request.qs(),
    })

    const { notifications, unreadCount, totalCount, currentPage } =
      await this.notificationService.getUserNotifications(user, page, limit)

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

    const user = auth.user!

    await this.notificationService.deleteNotification(params.notificationId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(null, 'Notification deleted.')

    return response.ok(formattedResponse)
  }

  async destroyAll(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    await this.notificationService.deleteAllNotifications(user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'All notifications deleted.'
    )

    return response.ok(formattedResponse)
  }

  async markAsRead(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const user = auth.user!

    const notification = await this.notificationService.markAsRead(params.notificationId, user)

    const formattedResponse: NotificationSuccessResponse = await ctx.serialize(
      { notification: NotificationTransformer.transform(notification) },
      'Notification read.'
    )

    return response.ok(formattedResponse)
  }

  async markAsUnread(ctx: HttpContext) {
    const { params, auth, response } = ctx

    const user = auth.user!

    const notification = await this.notificationService.markAsUnread(params.notificationId, user)

    const formattedResponse: NotificationSuccessResponse = await ctx.serialize(
      { notification: NotificationTransformer.transform(notification) },
      'Notification marked as unread.'
    )

    return response.ok(formattedResponse)
  }

  async markAllAsRead(ctx: HttpContext) {
    const { auth, response } = ctx

    const user = auth.user!

    await this.notificationService.markAllAsRead(user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'All notifications marked as read.'
    )

    return response.ok(formattedResponse)
  }
}
