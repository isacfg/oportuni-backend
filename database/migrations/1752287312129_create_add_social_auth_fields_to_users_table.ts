import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id').nullable().unique()
      table.string('avatar_url').nullable()
      table.boolean('email_verified').defaultTo(false)

      // Remove password column since we only use social auth
      table.dropColumn('password')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id')
      table.dropColumn('avatar_url')
      table.dropColumn('email_verified')

      // Re-add password column
      table.string('password').notNullable()
    })
  }
}
