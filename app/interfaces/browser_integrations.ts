import type { BrowserType } from '#enums/browser'

interface Integration {
  id: string
  browser: BrowserType
  lastSyncedAt: string
  createdAt: string
  deviceName: string | null
  extensionVersion: string | null
}

export interface GetBrowserIntegrationsResponse {
  success: boolean
  message: string
  data: {
    integrations: Integration[]
  }
}
