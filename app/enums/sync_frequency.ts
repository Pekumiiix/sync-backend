export const SYNC_FREQUENCY = ['immediate', '3_hours', '6_hours', '12_hours'] as const

export const SYNC_FREQUENCY_IN_HOURS: Record<string, number> = {
  'immediate': 0,
  '3_hours': 3,
  '6_hours': 6,
  '12_hours': 12,
}

export const SYNC_FREQUENCY_IN_HOURS_TO_STRING: Record<number, string> = {
  0: 'immediate',
  3: '3_hours',
  6: '6_hours',
  12: '12_hours',
}

export type SyncFrequency = (typeof SYNC_FREQUENCY)[number]
