import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, computed, scope } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Article from './Article'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public body: string

  @column({ serializeAs : null })
  public userId: number

  @column({ serializeAs : null })
  public articleId: number

  @belongsTo(() => User, { foreignKey: 'userId', serializeAs : null })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Article, { foreignKey: 'articleId', serializeAs : null } )
  public article: BelongsTo<typeof Article>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  @computed()
  public get author(){
    return this.user ? this.user.username : null;
  }

  // -- Scopes declaractions --
  public static forArticle = scope((query, slug) => {
    const subQuery = Database
      .from('articles')
      .select('articles.id')
      .where('articles.slug', slug);

    query.whereIn('article_id', subQuery);
  })
}
