export interface BookmarkAddedBy {
  id: string
  avatarUrl: string | null
  firstName: string
  lastName: string
}

export interface BookmarkResponse {
  id: string
  folderId: string
  title: string
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
  addedBy: BookmarkAddedBy | null
}
