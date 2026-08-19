/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', (ctx) => {
  const key = ctx.auth?.user?.id ? `user_${ctx.auth.user.id}` : `ip_${ctx.request.ip()}`

  return limiter.allowRequests(50).every('1 minute').usingKey(key)
})

export const authThrottle = limiter.define('auth', (ctx) => {
  const key = `ip_${ctx.request.ip()}`

  return limiter.allowRequests(5).every('5 mins').usingKey(key)
})

export const resendThrottle = limiter.define('resendVerification', (ctx) => {
  const key = ctx.auth?.user?.id ? `user_${ctx.auth.user.id}` : `ip_${ctx.request.ip()}`

  return limiter.allowRequests(1).every('1 minute').usingKey(key)
})

export const searchThrottle = limiter.define('search', (ctx) => {
  const key = ctx.auth?.user?.id ? `user_${ctx.auth.user.id}` : `ip_${ctx.request.ip()}`

  return limiter.allowRequests(60).every('1 minute').usingKey(key)
})

export const extensionThrottle = limiter.define('extension', (ctx) => {
  const key = ctx.auth?.user?.id ? `user_${ctx.auth.user.id}` : `ip_${ctx.request.ip()}`

  return limiter.allowRequests(60).every('1 minute').usingKey(key)
})
