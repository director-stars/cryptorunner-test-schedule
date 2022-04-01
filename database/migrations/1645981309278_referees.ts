import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Referees extends BaseSchema {
  protected tableName = 'referees'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('account_id').unique()
      table.string('address')
      table.boolean('is_rewarded').defaultTo(false)
      table.boolean('is_tweeted').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
