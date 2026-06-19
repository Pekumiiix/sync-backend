/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.new_account.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/sign-up',
    tokens: [{"old":"/api/v1/auth/sign-up","type":0,"val":"api","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/sign-up","type":0,"val":"sign-up","end":""}],
    types: placeholder as Registry['auth.new_account.store']['types'],
  },
  'auth.access_tokens.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/sign-in',
    tokens: [{"old":"/api/v1/auth/sign-in","type":0,"val":"api","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/sign-in","type":0,"val":"sign-in","end":""}],
    types: placeholder as Registry['auth.access_tokens.store']['types'],
  },
  'auth.forgot_password.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/forgot-password',
    tokens: [{"old":"/api/v1/auth/forgot-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['auth.forgot_password.store']['types'],
  },
  'auth.reset_password.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/reset-password',
    tokens: [{"old":"/api/v1/auth/reset-password","type":0,"val":"api","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/reset-password","type":0,"val":"reset-password","end":""}],
    types: placeholder as Registry['auth.reset_password.store']['types'],
  },
  'auth.verify_email.store': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email',
    tokens: [{"old":"/api/v1/auth/verify-email","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email","type":0,"val":"verify-email","end":""}],
    types: placeholder as Registry['auth.verify_email.store']['types'],
  },
  'auth.verify_email.resend': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-email/resend',
    tokens: [{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"verify-email","end":""},{"old":"/api/v1/auth/verify-email/resend","type":0,"val":"resend","end":""}],
    types: placeholder as Registry['auth.verify_email.resend']['types'],
  },
  'profile.profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.profile.show']['types'],
  },
  'profile.access_tokens.destroy': {
    methods: ["POST"],
    pattern: '/api/v1/account/sign-out',
    tokens: [{"old":"/api/v1/account/sign-out","type":0,"val":"api","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"v1","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"account","end":""},{"old":"/api/v1/account/sign-out","type":0,"val":"sign-out","end":""}],
    types: placeholder as Registry['profile.access_tokens.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
