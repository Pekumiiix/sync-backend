export const INVITATION_STATUSES = ['pending', 'accepted', 'declined', 'expired'] as const

export type InvitationStatusType = (typeof INVITATION_STATUSES)[number]
