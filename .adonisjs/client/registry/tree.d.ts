/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessTokens: {
      store: typeof routes['auth.access_tokens.store']
    }
    forgotPasswords: {
      store: typeof routes['auth.forgot_passwords.store']
    }
    resetPasswords: {
      store: typeof routes['auth.reset_passwords.store']
    }
    verifyEmails: {
      store: typeof routes['auth.verify_emails.store']
      resend: typeof routes['auth.verify_emails.resend']
    }
  }
  oauths: {
    googles: {
      redirect: typeof routes['oauths.googles.redirect']
      store: typeof routes['oauths.googles.store']
      destroy: typeof routes['oauths.googles.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      update: typeof routes['profile.profile.update']
    }
    accessTokens: {
      destroy: typeof routes['profile.access_tokens.destroy']
    }
  }
  folder: {
    folder: {
      index: typeof routes['folder.folder.index']
      store: typeof routes['folder.folder.store']
      join: typeof routes['folder.folder.join']
      destroy: typeof routes['folder.folder.destroy']
      update: typeof routes['folder.folder.update']
      show: typeof routes['folder.folder.show']
    }
  }
  bookmarks: {
    bookmark: {
      store: typeof routes['bookmarks.bookmark.store']
      fetch: typeof routes['bookmarks.bookmark.fetch']
      update: typeof routes['bookmarks.bookmark.update']
      destroy: typeof routes['bookmarks.bookmark.destroy']
      pin: typeof routes['bookmarks.bookmark.pin']
      unpin: typeof routes['bookmarks.bookmark.unpin']
    }
  }
  members: {
    member: {
      index: typeof routes['members.member.index']
      leave: typeof routes['members.member.leave']
      update: typeof routes['members.member.update']
      destroy: typeof routes['members.member.destroy']
    }
  }
  invitations: {
    invitation: {
      index: typeof routes['invitations.invitation.index']
      store: typeof routes['invitations.invitation.store']
      destroy: typeof routes['invitations.invitation.destroy']
      accept: typeof routes['invitations.invitation.accept']
    }
  }
  notifications: {
    notifications: {
      index: typeof routes['notifications.notifications.index']
      markAllAsRead: typeof routes['notifications.notifications.mark_all_as_read']
      destroy: typeof routes['notifications.notifications.destroy']
      markAsRead: typeof routes['notifications.notifications.mark_as_read']
      markAsUnread: typeof routes['notifications.notifications.mark_as_unread']
    }
  }
}
