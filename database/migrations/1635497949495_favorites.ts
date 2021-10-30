import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Favorites extends BaseSchema {
  protected tableName = 'favorites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['article_id','user_id']);

      table.integer('article_id').notNullable();
      table.integer('user_id').notNullable();

      table.foreign('user_id').references('user.id')
      table.foreign('article_id').references('user.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
