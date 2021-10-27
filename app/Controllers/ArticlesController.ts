// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article"
import Tag from "App/Models/Tag";
import StoreArticleValidator from "App/Validators/Article/StoreArticleValidator";

export default class ArticlesController {

    public async index({request, response}){

        let articles: Article[];
        let articlesCount:Number;
        
        if(request.qs().author){
            articles = await Database
                .from('articles')
                .join('users', 'users.id', '=', 'articles.user_id');
            articlesCount = 0;
        }
        else{
            articles = await Article.all();
            articles = await Article
                .query()
                .join('articles_tags','articles_tags.articles_id','=','articles.id')
                .join('tags','articles_tags.tags_id','=','tags.id')
            
            
            articlesCount = (await Database.from('articles').count('* as total'))[0].total;
        }



        /*if(request.qs()) articles = await Article.query();
        else articles = await Article.query().where('author', request.qs().author);*/
        /*
        else if(request.qs().favorited) articles = await Article.query().where('favorited', request.qs().favorited);
        else if(request.qs().tag) articles = await Article.query().where('tag', request.qs().tag);
        */



        response.ok({ articlesCount, articles })
    }

    public async store({auth, request,response}){
        const { article : { tagList, ...payload } } = await request.validate(StoreArticleValidator);


        const   article = (await Article.create(payload));
                article.userId = auth.user.id

        /*article.tags = await Tag.fetchOrCreateMany(
            "name", 
            tagList.map((nameTag: string) => ({ name : nameTag })),
        )*/



        response.created({ article : { ...article.serialize() } })
    }

}
