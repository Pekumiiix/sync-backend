import type { Data } from '#client/data'

export interface SearchResponse {
  data: {
    bookmarks: Data.Bookmark[]
    meta: {
      currentPage: number
      totalPages: number
      totalCount: number
    }
  }
  success: boolean
  message: string
}
