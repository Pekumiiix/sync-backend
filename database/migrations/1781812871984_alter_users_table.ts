import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('reset_password_token').nullable()
      table.timestamp('reset_password_token_expires_at', { useTz: true }).nullable()
      table.renameColumn('email_verification_expires_at', 'email_verification_token_expires_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('reset_password_token', 'reset_password_token_expires_at')
      table.renameColumn('email_verification_token_expires_at', 'email_verification_expires_at')
    })
  }
}
