// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import Article from 'App/Models/Article'
import Tag from 'App/Models/Tag'
import StoreArticleValidator from 'App/Validators/Article/StoreArticleValidator'

import Event from '@ioc:Adonis/Core/Event'
import { ExtractScopes } from '@ioc:Adonis/Lucid/Orm'
import UpdateArticleValidator from 'App/Validators/Article/UpdateArticleValidator'


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
      : await Article.query().withScopes(scope);

    response.ok({
      articlesCount: articles.length,
      articles: articles.map((article) => article.serialize()),
    })
  }

  public async store({ auth, request, response }) {
    const { article: { tagList, ...payload } } = await request.validate(StoreArticleValidator)

    const article = await Article.create({ ...payload, userId: auth.user.id })

    const tags = await Tag.fetchOrCreateMany(
      'name',
      tagList.map((nameTag: string) => ({ name: nameTag }))
    )

    await article.related('tags').attach([...tags.map(tag => tag.id)]);

    await article.load((loader) => loader.load('author').load('tags').load('favorites') )

    response.created({ article: article.serialize() })
  }

  public async oneBySlug({ request, response }) {
    const articles = await Article.query().where('slug', request.params().slug).limit(1);

    if(articles.length == 0 ) return response.notFound({ message : 'Noone article found'});

    response.ok({ article : articles[0] });
  }

  public async update({auth, request, response }) {

    const articles = await Article.query()
      .where('slug', request.params().slug )
      .andWhere('user_id', auth.user.id)
      .limit(1);

    if(articles.length == 0) return response.notFound();

    const { article: { ...payload } } = await request.validate(UpdateArticleValidator);



    response.ok({ article : (await articles[0].merge(payload).save()) })

  }

  public async delete({auth,request,response}){

    await Article.query()
      .where('slug', request.params().slug)
      .where('user_id', auth.user.id)
      .delete()

    response.noContent();

  }

}
