// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from "App/Models/User";

import Event from '@ioc:Adonis/Core/Event'
import Database from "@ioc:Adonis/Lucid/Database";


Event.on('db:query', Database.prettyPrint)

export default class ProfilesController {

    public async oneByUsername({auth, request, response}){
        const celeb = await User.query()
            .where('username', request.params().username)
            .first();

        if(!celeb) return response.notFound({ message : 'celeb not found' })
        
        await celeb.load('followers')
        celeb.setFollowing(auth.user.id);
        

        return response.ok({ profile : celeb.serialize() });
    }

    public async store({auth, request, response}){
        const celeb =  await User.findBy('username', request.params().username);
        if(!celeb) return response.notFound({ message : 'Celeb not found' });

        await celeb.related('followers').detach([auth.user.id]);
        await celeb.related('followers').attach([auth.user.id]);
        await celeb.load('followers');

        celeb.setFollowing(auth.user.id);

        response.ok({profile : celeb});
    }

    public async delete({auth, request, response}){
        const celeb =  await User.findBy('username', request.params().username);
        if(!celeb) return response.notFound({ message : 'Celeb not found' });

        celeb.related('followers').detach([auth.user.id]);

        await celeb.load('followers');
        celeb.setFollowing(auth.user.id);

        response.ok({profile : celeb});
    }

}
