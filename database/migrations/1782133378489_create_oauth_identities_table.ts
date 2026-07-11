import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'oauth_identities'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.string('provider').notNullable()
      table.string('provider_id').notNullable()

      table.text('access_token').nullable()
      table.text('refresh_token').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      table.unique(['provider', 'provider_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
