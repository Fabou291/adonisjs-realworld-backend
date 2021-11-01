import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Follows extends BaseSchema {
  protected tableName = 'follows'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {

      table.primary(['followed_id', 'following_id']);
      table.integer('followed_id').notNullable();
      table.integer('following_id').notNullable();

      table.foreign('followed_id').references('users.id');
      table.foreign('following_id').references('users.id');
      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
