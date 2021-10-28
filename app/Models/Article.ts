import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  scope,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Tag from './Tag'

export default class Article extends BaseModel {



  public static forAuthor = scope((query, username) => {
    const subQuery = Database
      .from('users')
      .select('users.id')
      .where('users.username', username)

    query.whereIn('id', subQuery)
  })

  public static forTag = scope((query, tag) => {
    const subQuery = Database
      .from('tags')
      .join('article_tag', 'tags.id', '=', 'article_tag.tag_id')
      .select('article_tag.article_id')
      .where('tags.name', tag)

    query.whereIn('id', subQuery)
  })

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  @slugify({ strategy: 'dbIncrement', fields: ['title'] })
  public slug: string

  @column()
  public body: string

  @column()
  public description: string

  @column()
  public userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public author: BelongsTo<typeof User>

  @manyToMany(() => Tag)
  public tagList: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime
}
