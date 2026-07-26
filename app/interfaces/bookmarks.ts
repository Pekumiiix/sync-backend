import { type BrowserType } from '#enums/browser'

// Core models

export interface UrlData {
  title: string
  description: string
  coverImageUrl: string | undefined
  faviconUrl: string | undefined
  websiteName: string | undefined
  domain: string
  url: string
}

interface BookmarkAddedBy {
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export interface BookmarkData {
  id: string
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
  folder: {
    id: string
    name: string | null
  }
  addedBy: BookmarkAddedBy | null
}

// Response interfaces

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

export interface GetBrowsersResponse {
  success: true
  message: string
  data: {
    browsers: { browser: BrowserType }[]
  }
}
