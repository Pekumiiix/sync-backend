import { ACCESS_LEVELS, ROLES } from '#enums/member'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'members'

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

      table.unique(['folder_id', 'user_id'])

      table.enum('role', [...ROLES]).notNullable()
      table.enum('access_level', [...ACCESS_LEVELS]).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
