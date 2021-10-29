// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Article from 'App/Models/Article'
import Tag from 'App/Models/Tag'
import StoreArticleValidator from 'App/Validators/Article/StoreArticleValidator'

import Event from '@ioc:Adonis/Core/Event'
import { ExtractScopes } from '@ioc:Adonis/Lucid/Orm'

Event.on('db:query', Database.prettyPrint)

export default class ArticlesController {
  public async index({ request, response }) {
    let scope: any = null

    switch(request.qs()){
      case request.qs().hasOwnProperty('author') : 
        scope = (scopes: ExtractScopes<typeof Article>) => scopes.forAuthor(request.qs().author);
      break;
      case request.qs().hasOwnProperty('tag') : 
        scope = (scopes: ExtractScopes<typeof Article>) => scopes.forAuthor(request.qs().tag);
      break;
      case request.qs().hasOwnProperty('favorited') : 
        scope = (scopes: ExtractScopes<typeof Article>) => scopes.forAuthor(request.qs().favorited);
      break;
    }

    const articles = !scope 
      ? await Article.query()
          .preload('tagList')
          .preload('author')
          .withCount('favorited', (query) => query.as('favoritesCount'))
          .preload('favorited')

      : await Article.query()
          .preload('tagList')
          .preload('author')
          .withCount('favorited', (query) => query.as('favoritesCount'))
          .preload('favorited')
          .withScopes(scope);

    response.ok({
      articlesCount: articles.length,
      articles: articles.map((article) => article.serialize()),
    })
  }

  public async store({ auth, request, response }) {
    const {
      article: { tagList, ...payload },
    } = await request.validate(StoreArticleValidator)

    const article = await Article.create({ ...payload, userId: auth.user.id })

    await Tag.fetchOrCreateMany(
      'name',
      tagList.map((nameTag: string) => ({ name: nameTag }))
    )

    /*article.tags = await Tag.fetchOrCreateMany(
        "name", 
        tagList.map((nameTag: string) => ({ name : nameTag })),
    )*/

    response.created({ article: { ...article.serialize() } })
  }

  public async oneBySlug({ request, response }) {
    const article = (await Article.query().where('slug', request.params().slug))[0]
    response.ok({
      article: article,
    })
  }
}
