import { type AccessLevelType, type RoleType } from '#enums/member'
import type { Data } from '#client/data'

// Core models

export interface FolderPermission {
  role: AccessLevelType
  accessLevel: RoleType
}

interface PreviewMember {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

// Response interfaces

export interface FolderIndexResponse {
  success: true
  message: string
  data: {
    systemFolders: Data.Folder[]
    ownedFolders: Data.Folder[]
    sharedFolders: Data.Folder[]
    meta: {
      totalBookmarks: number
    }
  }
}

export interface FolderStoreResponse {
  success: true
  message: string
  data: {
    folder: Data.Folder
  }
}

export interface ShowFolderResponse {
  success: true
  message: string
  data: {
    folder: {
      id: string
      name: string
      isSystem: boolean
      bookmarkCount: number
      memberCount: number
      isProtected: boolean
    }
    permission: FolderPermission
    previewMembers: PreviewMember[]
    pinnedBookmarks: Data.Bookmark[]
    bookmarks: Data.Bookmark[]
    meta: {
      currentPage: number
      totalPages: number
      totalCount: number
    }
  }
}
