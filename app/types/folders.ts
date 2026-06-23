import { AccessLevelType, RoleType } from '#enums/member'
import type { BookmarkResponse } from '#types/bookmarks'

export type FolderResponse = {
  id: string
  name: string
  bookmarkCount: number
  recentBookmarksImages: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

type PreviewMember = {
  id: string
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export type ShowFolderResponse = {
  id: string
  name: string
  bookmarkCount: number
  isSystem: boolean
  memberCount: number
  previewMembers: PreviewMember[]
  isProtected: boolean
  createdAt: string
  updatedAt: string
}

export type FolderSingleData = {
  folder: FolderResponse
}

export type FolderIndexData = {
  systemFolders: FolderResponse[]
  ownedFolders: FolderResponse[]
  sharedFolders: FolderResponse[]
}

export type PaginationMeta = {
  totalCount: number
  currentPage: number
  totalPages: number
  hasNextPage: boolean
}

export type FolderPermission = {
  role: AccessLevelType
  accessLevel: RoleType
}

export type FolderShowData = {
  folder: ShowFolderResponse
  permission: FolderPermission
  pinnedBookmarks: BookmarkResponse[]
  data: BookmarkResponse[]
  meta: PaginationMeta
}
