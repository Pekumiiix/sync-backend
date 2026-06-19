import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('folder_id').references('id').inTable('folders').onDelete('CASCADE').notNullable()
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').notNullable()

      table.string('title').notNullable()
      table.string('description').nullable()
      table.string('website_name').notNullable()
      table.string('url').notNullable()
      table.string('domain').notNullable()

      table.boolean('is_pinned').defaultTo(false).notNullable()
      table.enum('browser', ['chrome', 'firefox', 'edge', 'arc', 'opera', 'brave']).notNullable()

      table.string('cover_image_url').nullable()
      table.string('favicon_url').nullable()

      table.json('tags').defaultTo('[]').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
