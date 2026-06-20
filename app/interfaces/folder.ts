import { BookmarkResponse } from './bookmark.ts'

export interface FolderResponse {
  id: string
  name: string
  bookmarkCount: number
  recentBookmarksImages: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

interface PreviewMember {
  id: string
  fisrtName: string
  lastName: string
  avatarUrl: string | null
}

export interface ShowFolderResponse {
  id: string
  name: string
  bookmarkCount: number
  isSystem: boolean
  memberCount: number
  previewMembers: PreviewMember[]
}

export interface FolderSingleData {
  folder: FolderResponse
}

export interface FolderIndexData {
  systemFolders: FolderResponse[]
  ownedFolders: FolderResponse[]
  sharedFolders: FolderResponse[]
}

export interface PaginationMeta {
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
}

export interface FolderPermission {
  /**
   * Expected values: 'admin', 'member'
   * @example "admin"
   */
  role: string
  /**
   * Expected values: 'editor', 'viewer'
   * @example "editor"
   */
  accessLevel: string
}

export interface FolderShowData {
  folder: ShowFolderResponse
  permission: FolderPermission
  pinnedBookmarks: BookmarkResponse[]
  data: BookmarkResponse[]
  meta: PaginationMeta
}
