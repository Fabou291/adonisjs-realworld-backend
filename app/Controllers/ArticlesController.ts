// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Article from "App/Models/Article"
import StoreArticleValidator from "App/Validators/Article/StoreArticleValidator";

export default class ArticlesController {

    public async index({request, response}){

        let articles: Article[];
        let articlesCount:Number;
        
        if(request.qs().author){
            articles = await Database
                .from('articles')
                .join('users', 'users.id', '=', 'articles.author_id');
            articlesCount = 0;
        }
        else{
            articles = await Article.all()
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

    public async store({request,response}){
        const payload = await request.validate(StoreArticleValidator);
        const article = (await Article.create(payload.article)).serialize();
        response.created({article})
    }

}
