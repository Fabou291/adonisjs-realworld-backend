 import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

    public async login({auth, request, response}: HttpContextContract){

        

        const { user : { email, password } } = request.body();
        const token = await auth.attempt( email, password);
        
        const user = auth.user!

        return response.ok({ 
            user : {
                ...user.serialize(),
                token : token.token
            }
         });

    }

    public async me({auth, response}: HttpContextContract){
        return response.ok({
            user : auth.user!.serialize()
        })
    }

}
