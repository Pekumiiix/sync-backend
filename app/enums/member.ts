export const ACCESS_LEVELS = ['viewer', 'editor'] as const
export const ROLES = ['admin', 'member'] as const

export type AccessLevelType = (typeof ACCESS_LEVELS)[number]
export type RoleType = (typeof ROLES)[number]
