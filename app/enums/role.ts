export const ROLES = ['admin', 'member'] as const

export type RoleType = (typeof ROLES)[number]
