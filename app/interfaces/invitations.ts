import type { Data } from '#client/data'

// Response interfaces

export interface ListInvitationsResponse {
  data: { pendingInvitations: Data.Invitation[]; resolvedInvitations: Data.Invitation[] }
  success: boolean
  message: string
}

export interface InvitationSuccessResponse {
  data: { invitation: Data.Invitation }
  success: boolean
  message: string
}
