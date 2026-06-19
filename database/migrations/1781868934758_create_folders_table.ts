import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.string('name').notNullable()
      table.integer('bookmark_count').defaultTo(0).notNullable()
      table.boolean('is_system').defaultTo(false).notNullable()
      table.jsonb('recent_bookmarks_images').defaultTo('[]').notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
