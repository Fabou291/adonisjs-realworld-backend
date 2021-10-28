// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Article from 'App/Models/Article'
import Tag from 'App/Models/Tag'
import StoreArticleValidator from 'App/Validators/Article/StoreArticleValidator'

import Event from '@ioc:Adonis/Core/Event'

Event.on('db:query', Database.prettyPrint)

export default class ArticlesController {
  public async index({ request, response }) {
    let articles: Article[]

    if (request.qs().author) {
        articles = await Article.query()
            .withScopes((scopes) => scopes.forAuthor(request.qs().author))
            .preload('tagList')
            .preload('author')
    }
    else if(request.qs().tag){
        articles = await Article.query()
            .withScopes((scopes) => scopes.forTag(request.qs().tag))
            .preload('tagList')
            .preload('author')
    }
    else {
      articles = await Article.query().preload('tagList').preload('author')
    }

    /*if(request.qs()) articles = await Article.query();
        else articles = await Article.query().where('author', request.qs().author);*/
    /*
        else if(request.qs().favorited) articles = await Article.query().where('favorited', request.qs().favorited);
        else if(request.qs().tag) articles = await Article.query().where('tag', request.qs().tag);
    */

    response.ok({ articlesCount: articles.length, articles })
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

  public async oneBySlug({request, response}) {
    const article = (await Article.query().where('slug', request.params().slug))[0];
    response.ok({
        article : article
    });
  }
}
