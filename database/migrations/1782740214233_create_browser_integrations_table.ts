import { SUPPORTED_BROWSERS } from '#enums/browser'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'browser_integrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()

      table.enum('browser', [...SUPPORTED_BROWSERS]).notNullable()

      table.string('device_name').nullable()
      table.string('extension_version').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('last_synced_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
