export const SUPPORTED_BROWSERS = [
  'chrome',
  'firefox',
  'safari',
  'edge',
  'arc',
  'opera',
  'brave',
  'other',
  'manual',
] as const

export type BrowserType = (typeof SUPPORTED_BROWSERS)[number]
