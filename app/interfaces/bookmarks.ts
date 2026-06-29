export interface UrlData {
  title: string | null
  description: string | null
  coverImageUrl: string | null
  faviconUrl: string | null
  websiteName: string | null
  domain: string
  url: string
}

export interface BookmarkAddedBy {
  id: string
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export interface BookmarkData {
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

export interface IndexBookmarksResponse {
  success: true
  message: string
  data: {
    bookmarks: BookmarkData[]
    pinnedBookmarks: BookmarkData[]
    meta: {
      currentPage: number
      totalPages: number
      totalCount: number
    }
  }
}

export interface FetchBookmarkPreviewResponse {
  success: true
  message: string
  data: {
    openGraphData: UrlData
  }
}
