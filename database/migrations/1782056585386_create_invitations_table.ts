import { ACCESS_LEVELS } from '#enums/member'
import { BaseSchema } from '@adonisjs/lucid/schema'
import { INVITATION_STATUSES } from '#enums/invitation'

export default class extends BaseSchema {
  protected tableName = 'invitations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table
        .uuid('folder_id')
        .notNullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
        .index()
      table
        .uuid('inviter_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .index()

      table.string('email').notNullable()
      table.string('token').notNullable().unique()

      table
        .enum('status', [...INVITATION_STATUSES])
        .defaultTo('pending')
        .notNullable()
      table
        .enum('access_level', [...ACCESS_LEVELS])
        .defaultTo('viewer')
        .notNullable()

      table.timestamp('expires_at', { useTz: true }).notNullable()

      table.timestamp('accepted_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.index(['folder_id', 'email'])
      table.index(['email', 'status'])
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        CREATE UNIQUE INDEX invitations_unique_pending_idx 
        ON invitations (folder_id, email) 
        WHERE status = 'pending';
      `)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery('DROP INDEX IF EXISTS invitations_unique_pending_idx;')
    })

    this.schema.dropTable(this.tableName)
  }
}
