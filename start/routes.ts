/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.post('users', 'UsersController.store');
Route.post('users/login', 'AuthController.login');
Route.get('user', 'AuthController.me').middleware(['auth']);
Route.put('user', 'UsersController.modify').middleware(['auth']);

Route.get('articles', 'ArticlesController.index');
Route.post('articles', 'ArticlesController.store').middleware(['auth']);
Route.get('articles/:slug', 'ArticlesController.oneBySlug').middleware(['auth']);
