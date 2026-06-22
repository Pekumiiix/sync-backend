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
      store: typeof routes['folder.folder.store']
      destroy: typeof routes['folder.folder.destroy']
      update: typeof routes['folder.folder.update']
      index: typeof routes['folder.folder.index']
      show: typeof routes['folder.folder.show']
    }
  }
  bookmarks: {
    bookmark: {
      fetch: typeof routes['bookmarks.bookmark.fetch']
      store: typeof routes['bookmarks.bookmark.store']
      update: typeof routes['bookmarks.bookmark.update']
      pin: typeof routes['bookmarks.bookmark.pin']
      unpin: typeof routes['bookmarks.bookmark.unpin']
      destroy: typeof routes['bookmarks.bookmark.destroy']
    }
  }
  members: {
    member: {
      index: typeof routes['members.member.index']
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
}
