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
  bookmark: {
    bookmarks: {
      destroy: typeof routes['bookmark.bookmarks.destroy']
    }
  }
}
