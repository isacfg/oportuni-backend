import { BaseSchema } from '@adonisjs/lucid/schema'
import { CONTRACT_TYPE_VALUES } from '../../app/enums/index.js'

export default class extends BaseSchema {
  protected tableName = 'job_posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table
        .integer('company_id')
        .unsigned()
        .references('id')
        .inTable('companies')
        .onDelete('CASCADE')
      table.enum('contract_type', CONTRACT_TYPE_VALUES).notNullable()
      table.string('location').notNullable()
      table.boolean('remote').defaultTo(false)
      table.string('application_url').nullable()
      table.boolean('simplified_application').defaultTo(false)
      table.boolean('reduced_hours').defaultTo(false)
      table.string('external_url').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
