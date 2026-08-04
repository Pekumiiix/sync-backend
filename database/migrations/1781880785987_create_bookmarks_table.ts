import { SUPPORTED_BROWSERS } from '#enums/browser'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('folder_id').references('id').inTable('folders').onDelete('CASCADE').notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()

      table.text('title').nullable()
      table.text('description').nullable()
      table.string('website_name').nullable()

      table.text('url').notNullable()
      table.string('domain').notNullable()

      table.boolean('is_pinned').defaultTo(false).notNullable()

      table.enum('browser', SUPPORTED_BROWSERS).notNullable().defaultTo('manual')

      table.text('cover_image_url').nullable()
      table.text('favicon_url').nullable()

      table.jsonb('tags').defaultTo('[]').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'folder_id', 'created_at'])
      table.index(['user_id', 'is_pinned', 'folder_id'])

      table.index(['tags'], 'bookmarks_tags_gin', 'gin')
    })

    this.defer(async (db) => {
      await db.rawQuery('CREATE EXTENSION IF NOT EXISTS pg_trgm;')

      await db.rawQuery(`
        CREATE INDEX bookmarks_search_trgm_idx 
        ON bookmarks 
        USING GIN ((coalesce(title, '') || ' ' || url) gin_trgm_ops);
      `)

      await db.rawQuery(`
        CREATE INDEX bookmarks_sort_title_idx 
        ON bookmarks (user_id, folder_id, LOWER(title));
      `)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery('DROP INDEX IF EXISTS bookmarks_search_trgm_idx;')
      await db.rawQuery('DROP INDEX IF EXISTS bookmarks_sort_title_idx;')
    })

    this.schema.dropTable(this.tableName)
  }
}
