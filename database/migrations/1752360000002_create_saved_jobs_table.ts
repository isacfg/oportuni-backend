import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'saved_jobs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('job_post_id')
        .unsigned()
        .references('id')
        .inTable('job_posts')
        .onDelete('CASCADE')
      table.timestamp('created_at').notNullable()

      // Prevent duplicate entries
      table.unique(['user_id', 'job_post_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
