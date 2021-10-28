import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, beforeCreate, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Article from './Article'
import { v4 as uuid } from 'uuid';

export default class User extends BaseModel {

  @column({ isPrimary : true })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public username:string

  @column()
  public rememberMeToken?: string

  @column()
  public bio?: string | null

  @column()
  public image?: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Article, { foreignKey: 'authorId' })
  public articles : HasMany<typeof Article>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  
  @beforeCreate()
  public static async createUUID(user: User){
    user.uuid = uuid();
  }

}