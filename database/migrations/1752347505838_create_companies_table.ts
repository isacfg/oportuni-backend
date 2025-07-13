import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name').notNullable()
      table.text('description')
      table.string('logo_url').nullable()
      table.string('facebook_url').nullable()
      table.string('linkedin_url').nullable()
      table.string('twitter_url').nullable()
      table.string('instagram_url').nullable()
      table.string('website_url').nullable()

      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
