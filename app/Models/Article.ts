import { DateTime } from 'luxon'
import { BaseModel, column, hasMany,HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Tag from './Tag'

export default class Article extends BaseModel {

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
  public userId : number

  @hasOne(() => User, { foreignKey: 'id' })
  public User: HasOne<typeof User>

  @hasMany(() => Tag, { serializeAs: 'tagList' })
  public tags: HasMany<typeof Tag>

  

  @column.dateTime({ autoCreate: true, serializeAs : 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs : 'updatedAt' })
  public updatedAt: DateTime
}
