import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import ModifyUserValidator from 'App/Validators/User/ModifyUserValidator';
import StoreUserValidator from 'App/Validators/User/StoreUserValidator';

export default class UsersController {

    public async store({request, response}: HttpContextContract){
        const payload = await request.validate(StoreUserValidator);
        const user = await User.create(payload.user)
        return response.created({
            user : {
                ...user.merge({bio : null, image : null }).serialize(),
                token : null
            }
        })
    }

    public async modify({auth, request, response}: HttpContextContract){
        const payload = await request.validate(ModifyUserValidator);
        const user = await auth.user!.merge(payload.user).save();
        return response.ok({ user : {
            ...user.serialize(),
            token : request.header('Authorization')!.split(' ')[1]
        } })
    }

}
