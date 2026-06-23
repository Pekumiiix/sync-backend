export const USER_PLANS = ['free', 'basic', 'standard'] as const

export type PlanType = (typeof USER_PLANS)[number]
