import { DateTime } from 'luxon'
import { BaseModel, column, computed, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

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

  @hasOne(() => User, { foreignKey: 'id' })
  public User: HasOne<typeof User>

  @column({ serializeAs : null })
  public tagList: string

  @computed({ serializeAs : 'tagList' })
  public get tagListArray():string[]
  {
    return this.tagList.split(',');
  }

  @column.dateTime({ autoCreate: true, serializeAs : 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs : 'updatedAt' })
  public updatedAt: DateTime
}
