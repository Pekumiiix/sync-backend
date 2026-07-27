import type { Data } from '#client/data'

// Response interfaces

export interface GetBrowserIntegrationsResponse {
  success: boolean
  message: string
  data: {
    integrations: Data.BrowserIntegration[]
  }
}
