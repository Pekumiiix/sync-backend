export interface UrlData {
  title: string
  description: string
  coverImageUrl: string
  faviconUrl: string
  websiteName: string
  domain: string
  url: string
}

export interface BookmarkAddedBy {
  id: string
  avatarUrl: string
  firstName: string
  lastName: string
}

export interface BookmarkResponse {
  id: string
  folderId: string
  title: string
  description: string
  url: string
  domain: string
  faviconUrl: string
  coverImageUrl: string
  websiteName: string
  tags: string[]
  isPinned: boolean
  browser: string
  createdAt: string
  updatedAt: string
  addedBy: BookmarkAddedBy
}
