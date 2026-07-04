import { UserSchema } from '#database/schema'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { afterCreate, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Folder from './folder.ts'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Member from './member.ts'
import Bookmark from './bookmark.ts'
import OauthIdentity from './o_auth_identity.ts'
import Notification from './notification.ts'
import BrowserIntegration from './browser_integration.ts'

export default class User extends compose(UserSchema, withAuthFinder(hash)) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @hasMany(() => Folder)
  declare ownedFolders: HasMany<typeof Folder>

  @hasMany(() => Bookmark)
  declare ownedBookmarks: HasMany<typeof Bookmark>

  @hasMany(() => Member)
  declare memberships: HasMany<typeof Member>

  @hasMany(() => OauthIdentity)
  declare oauthIdentities: HasMany<typeof OauthIdentity>

  @hasMany(() => BrowserIntegration)
  declare browserIntegrations: HasMany<typeof BrowserIntegration>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @manyToMany(() => Folder, {
    pivotTable: 'members',
    pivotColumns: ['role', 'access_level'],
  })
  declare sharedFolders: ManyToMany<typeof Folder>

  @manyToMany(() => Bookmark, {
    pivotTable: 'members',
  })
  declare sharedBookmarks: ManyToMany<typeof Bookmark>

  @afterCreate()
  public static async createDefaultFolder(user: User) {
    await user.related('ownedFolders').create(
      {
        name: 'Unsorted',
        isSystem: true,
      },
      { client: user.$trx }
    )
  }
}
