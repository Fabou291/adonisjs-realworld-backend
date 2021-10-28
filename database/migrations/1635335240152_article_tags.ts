import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ArticleTags extends BaseSchema {
  protected tableName = 'article_tag'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.primary(['article_id', 'tag_id'])
      table.integer('article_id').notNullable()
      table.integer('tag_id').notNullable()

      table.foreign('article_id').references('articles.id')
      table.foreign('tag_id').references('tags.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
