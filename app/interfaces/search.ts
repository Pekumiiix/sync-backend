import { type BookmarkData } from './bookmarks.ts'

export interface SearchResponse {
  data: {
    bookmarks: BookmarkData[]
    meta: {
      currentPage: number
      totalPages: number
      totalCount: number
    }
  }
  success: boolean
  message: string
}
