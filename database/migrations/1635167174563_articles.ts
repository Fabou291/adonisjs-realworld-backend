import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Articles extends BaseSchema {
  protected tableName = 'articles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('body').notNullable()
      table.text('description').notNullable()
      table.integer('users_id')
      table.json('tag_list').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('users_id').references('users.id').onDelete('CASCADE')
    })
  }



  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
