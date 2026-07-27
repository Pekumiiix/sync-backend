import { type BrowserType } from '#enums/browser'
import type { Data } from '#client/data'

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

// Response interfaces

export interface StoreBookmarkResponse {
  success: true
  message: string
  data: {
    bookmark: Data.Bookmark
  }
}

export interface IndexBookmarksResponse {
  success: true
  message: string
  data: {
    bookmarks: Data.Bookmark[]
    pinnedBookmarks: Data.Bookmark[]
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
