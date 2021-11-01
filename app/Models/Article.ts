import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  scope,
  beforeFetch,
  ModelQueryBuilderContract,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import User from './User'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Tag from './Tag'


export default class Article extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  @slugify({ strategy: 'shortId', fields: ['title'] })
  public slug: string

  @column()
  public body: string

  @column()
  public description: string

  @column()
  public userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  public author: BelongsTo<typeof User>

  @manyToMany(() => Tag, { serializeAs: null })
  public tags: ManyToMany<typeof Tag>

  @manyToMany(() => User, { pivotTable: 'favorites', serializeAs: null })
  public favorites: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true, serializeAs: 'createdAt' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updatedAt' })
  public updatedAt: DateTime

  // -- Computed properties -- 
  @computed()
  public get tagList(): string[]
  {
    return this.tags ? this.tags.map(tag => tag.name) : [];
  }

  @computed()
  public get favoritesCount(): number
  {
    return this.favorites ? this.favorites.length : 0;
  }

  @computed()
  public get favorited():boolean
  {
    return this.favorites && this.favorites.length > 0 
      ? true 
      : false;
  }


  // -- Scopes declarations -- 
  public static forAuthor = scope((query, username) => {
    const subQuery = Database
      .from('users')
      .select('users.id')
      .where('users.username', username);

    query.whereIn('id', subQuery);
  })

  public static forTag = scope((query, tag) => {
    const subQuery = Database
      .from('tags')
      .join('article_tag', 'tags.id', '=', 'article_tag.tag_id')
      .select('article_tag.article_id')
      .where('tags.name', tag);

    query.whereIn('id', subQuery);
  })

  public static forfavorites = scope((query, username) => {
    const subQuery = Database
      .from('users')
      .join('favorites', 'favorites.user_id', '=', 'users.id')
      .select('favorites.article_id')
      .where('users.username', username);

    query.whereIn('id', subQuery);
  })

  // -- Hooks déclarations -- 
  @beforeFetch()
  public static async preloads(query: ModelQueryBuilderContract <typeof Article>){
    query
      .preload('tags',(query) => query.orderBy('tags.name', 'asc'))
      .preload('author')
      .withCount('favorites', (query) => query.as('favoritesCount'))
      .preload('favorites')
  }
}
