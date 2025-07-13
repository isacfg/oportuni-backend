import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // Check if password column exists before trying to drop it
    const hasPasswordColumn = await this.schema.hasColumn(this.tableName, 'password')
    
    if (hasPasswordColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('password')
      })
    }
  }

  async down() {
    // Check if password column doesn't exist before trying to add it back
    const hasPasswordColumn = await this.schema.hasColumn(this.tableName, 'password')
    
    if (!hasPasswordColumn) {
      this.schema.alterTable(this.tableName, (table) => {
        table.string('password').notNullable()
      })
    }
  }
}
