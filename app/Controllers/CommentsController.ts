// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Article from "App/Models/Article";
import Comment from "App/Models/Comment";
import StoreCommentValidator from "App/Validators/Comment/StoreCommentValidator";

import Event from '@ioc:Adonis/Core/Event'
import Database from "@ioc:Adonis/Lucid/Database";


Event.on('db:query', Database.prettyPrint)

export default class CommentsController {

    public async index({request, response}){
        const comments = await Comment.query()
            .preload('user')
            .withScopes((scopes) => scopes.forArticle(request.params().slug))
        
        response.ok({ comments : comments.map(comment => comment.serialize()) })
    }
    
    public async store({auth, request, response}){

        const { comment : {body} } = await request.validate(StoreCommentValidator);

        const article = await Article.findBy('slug', request.params().slug);

        if(!article) return response.notFound({ message : 'This article does not exist' })

        const comment = await Comment.create({ body, userId : auth.user.id, articleId : article.id });

        await comment.load('user');

        response.created({ comment : comment.serialize() })

    }

    public async delete({auth, request, response}){

        await Comment.query()
        .where('id', request.params().id)
        .andWhere('user_id', auth.user.id)
        .delete()

        response.noContent();
    }

}
