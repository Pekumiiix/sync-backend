/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
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
  extension: {
    auth: {
      store: typeof routes['extension.auth.store']
      destroy: typeof routes['extension.auth.destroy']
    }
    bookmark: {
      store: typeof routes['extension.bookmark.store']
    }
  }
  oauths: {
    google: {
      redirect: typeof routes['oauths.google.redirect']
      store: typeof routes['oauths.google.store']
      destroy: typeof routes['oauths.google.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
      update: typeof routes['profile.profile.update']
      updateSettings: typeof routes['profile.profile.update_settings']
    }
  }
  folder: {
    folder: {
      index: typeof routes['folder.folder.index']
      store: typeof routes['folder.folder.store']
      destroy: typeof routes['folder.folder.destroy']
      update: typeof routes['folder.folder.update']
      show: typeof routes['folder.folder.show']
      showBookmarks: typeof routes['folder.folder.show_bookmarks']
      addPassword: typeof routes['folder.folder.add_password']
      changePassword: typeof routes['folder.folder.change_password']
      removePassword: typeof routes['folder.folder.remove_password']
    }
  }
  bookmarks: {
    bookmark: {
      store: typeof routes['bookmarks.bookmark.store']
      index: typeof routes['bookmarks.bookmark.index']
      preview: typeof routes['bookmarks.bookmark.preview']
      browsers: typeof routes['bookmarks.bookmark.browsers']
      bulkUnpin: typeof routes['bookmarks.bookmark.bulk_unpin']
      bulkMove: typeof routes['bookmarks.bookmark.bulk_move']
      bulkDestroy: typeof routes['bookmarks.bookmark.bulk_destroy']
      update: typeof routes['bookmarks.bookmark.update']
      destroy: typeof routes['bookmarks.bookmark.destroy']
      pin: typeof routes['bookmarks.bookmark.pin']
      unpin: typeof routes['bookmarks.bookmark.unpin']
      move: typeof routes['bookmarks.bookmark.move']
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
    notification: {
      index: typeof routes['notifications.notification.index']
      destroyAll: typeof routes['notifications.notification.destroy_all']
      markAllAsRead: typeof routes['notifications.notification.mark_all_as_read']
      destroy: typeof routes['notifications.notification.destroy']
      markAsRead: typeof routes['notifications.notification.mark_as_read']
      markAsUnread: typeof routes['notifications.notification.mark_as_unread']
    }
  }
  browserIntegrations: {
    integration: {
      index: typeof routes['browserIntegrations.integration.index']
      destroy: typeof routes['browserIntegrations.integration.destroy']
    }
  }
  search: {
    search: {
      index: typeof routes['search.search.index']
      folderSearch: typeof routes['search.search.folder_search']
    }
  }
  billing: {
    billing: {
      store: typeof routes['billing.billing.store']
      destroy: typeof routes['billing.billing.destroy']
      webhook: typeof routes['billing.billing.webhook']
    }
  }
  marketing: {
    contact: {
      store: typeof routes['marketing.contact.store']
    }
  }
}
