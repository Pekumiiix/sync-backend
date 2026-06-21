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
    forgotPassword: {
      store: typeof routes['auth.forgot_password.store']
    }
    resetPassword: {
      store: typeof routes['auth.reset_password.store']
    }
    verifyEmail: {
      store: typeof routes['auth.verify_email.store']
      resend: typeof routes['auth.verify_email.resend']
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
    folders: {
      store: typeof routes['folder.folders.store']
      destroy: typeof routes['folder.folders.destroy']
      update: typeof routes['folder.folders.update']
      index: typeof routes['folder.folders.index']
      show: typeof routes['folder.folders.show']
    }
  }
  bookmarks: {
    bookmarks: {
      fetch: typeof routes['bookmarks.bookmarks.fetch']
      store: typeof routes['bookmarks.bookmarks.store']
      update: typeof routes['bookmarks.bookmarks.update']
      pin: typeof routes['bookmarks.bookmarks.pin']
      unpin: typeof routes['bookmarks.bookmarks.unpin']
      destroy: typeof routes['bookmarks.bookmarks.destroy']
    }
  }
  member: {
    members: {
      index: typeof routes['member.members.index']
      update: typeof routes['member.members.update']
      destroy: typeof routes['member.members.destroy']
    }
  }
  invitations: {
    invitations: {
      index: typeof routes['invitations.invitations.index']
      store: typeof routes['invitations.invitations.store']
      destroy: typeof routes['invitations.invitations.destroy']
      accept: typeof routes['invitations.invitations.accept']
    }
  }
}
