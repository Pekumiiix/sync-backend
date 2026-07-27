import { USER_PLANS } from '#enums/user'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()

      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.boolean('is_email_verified').defaultTo(false).notNullable()

      table.string('location').nullable()
      table.string('avatar_url').nullable()

      table
        .enum('plan', [...USER_PLANS])
        .defaultTo('free')
        .notNullable()

      table.string('email_verification_token').nullable()
      table.timestamp('email_verification_token_expires_at', { useTz: true }).nullable()

      table.string('reset_password_token').nullable()
      table.timestamp('reset_password_token_expires_at', { useTz: true }).nullable()

      table
        .jsonb('settings')
        .defaultTo(
          JSON.stringify({
            autoMergeDuplicate: false,
            notifyOnNewMember: true,
            notifyOnNewBookmark: true,
            syncFrequencyInHours: 3,
          })
        )
        .notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
