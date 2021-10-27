import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ArticleTags extends BaseSchema {
  protected tableName = 'articles_tags'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['articles_id', 'tags_id'])
      table.integer('articles_id').notNullable()
      table.integer('tags_id').notNullable()

      table.foreign('articles_id').references('articles.id')
      table.foreign('tags_id').references('tags.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
