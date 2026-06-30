import { BrowserType } from '#enums/browser'
import { AccessLevelType, RoleType } from '#enums/member'
import type { BookmarkData } from '#interfaces/bookmarks'

export interface FolderResponse {
  id: string
  name: string
  bookmarkCount: number
  recentBookmarksImages: string[]
  isProtected: boolean
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface FolderIndexResponse {
  success: true
  message: string
  data: {
    systemFolders: FolderResponse[]
    ownedFolders: FolderResponse[]
    sharedFolders: FolderResponse[]
  }
}

export interface FolderStoreResponse {
  success: true
  message: string
  data: {
    folder: FolderResponse
  }
}

export interface FolderPermission {
  role: AccessLevelType
  accessLevel: RoleType
}

interface PreviewMember {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
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
    }
    permission: FolderPermission
    previewMembers: PreviewMember[]
    pinnedBookmarks: BookmarkData[]
    bookmarks: BookmarkData[]
    browserTypes: { browser: BrowserType }[]
    meta: {
      currentPage: number
      totalPages: number
    }
  }
}
