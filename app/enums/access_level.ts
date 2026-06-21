export const ACCESS_LEVELS = ['viewer', 'editor'] as const

export type AccessLevel = (typeof ACCESS_LEVELS)[number]
