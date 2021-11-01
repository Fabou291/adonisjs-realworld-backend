// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Article from 'App/Models/Article'

export default class FavoritesController {


    public async store({auth, request, response }) {
        const article = await Article.findByOrFail('slug', request.params().slug);
        
        await article.related('favorites').detach([auth.user.id]);
        await article.related('favorites').attach([auth.user.id]);
    
        await article.load(loader => loader.load('author').load('favorites').load('tags'))

        response.created({article : article.serialize()})
    }

    public async delete({auth, request, response }) {
        const article = await Article.findByOrFail('slug', request.params().slug);

        await article.related('favorites').detach([auth.user.id]);
    
        await article.load(loader => loader.load('author').load('favorites').load('tags'))

        response.ok({article : article.serialize()})
    }

}
