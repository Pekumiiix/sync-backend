export type UrlData = {
  title: string | null
  description: string | null
  coverImageUrl: string | null
  faviconUrl: string | null
  websiteName: string | null
  domain: string
  url: string
}

export type BookmarkAddedBy = {
  id: string
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export type BookmarkData = {
  id: string
  folderId: string
  title: string | null
  description: string | null
  url: string
  domain: string
  faviconUrl: string | null
  coverImageUrl: string | null
  websiteName: string | null
  tags: string[]
  isPinned: boolean
  browser: string
  createdAt: string
  updatedAt: string
  addedBy: BookmarkAddedBy
}

export interface StoreBookmarkResponse {
  success: true
  message: string
  data: {
    bookmark: BookmarkData
  }
}
