import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

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

      table.string('type').notNullable()

      // e.g., { actorName: 'John', folderName: 'Marketing', folderId: '123' }
      table.jsonb('data').notNullable()

      table.timestamp('read_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['user_id', 'created_at'])

      this.defer(async (db) => {
        await db.rawQuery(`
        CREATE INDEX notifications_unread_partial_idx 
        ON notifications (user_id) 
        WHERE read_at IS NULL;
      `)
      })
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery('DROP INDEX IF EXISTS notifications_unread_partial_idx;')
    })

    this.schema.dropTable(this.tableName)
  }
}
