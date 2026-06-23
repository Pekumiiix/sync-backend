import { SUPPORTED_BROWSERS } from '#enums/browser'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table
        .uuid('folder_id')
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
        .notNullable()
        .index()
      table
        .uuid('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .index()

      table.string('title').nullable()
      table.string('description').nullable()
      table.string('website_name').nullable()

      table.string('url').notNullable()
      table.string('domain').notNullable()

      table.boolean('is_pinned').defaultTo(false).notNullable()

      table.enum('browser', SUPPORTED_BROWSERS).notNullable().defaultTo('manual')

      table.string('cover_image_url').nullable()
      table.string('favicon_url').nullable()

      table.jsonb('tags').defaultTo('[]').notNullable()

      table.index(['tags'], 'folders_tags_gin', 'gin')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
