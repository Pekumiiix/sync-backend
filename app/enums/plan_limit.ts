import { type PlanType } from './user.ts'

export const PLAN_FOLDER_LIMITS: Record<PlanType, number> = {
  free: 3,
  basic: 20,
  standard: Infinity,
}

export const PLAN_MEMBER_LIMIT: Record<PlanType, number> = {
  free: 2,
  basic: 5,
  standard: 10,
}
