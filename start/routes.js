'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/
const Route = use('Route')

Route.get('test', ()=> {
  const hash = use('Hash')
  return hash.make('123456')
})

Route.get('/', 'SiteController.index')
Route.get('/about', 'SiteController.about')
Route.get('/site/categoryList', 'SiteController.categoryList')
Route.get('/profile', 'SiteController.profile').middleware(['auth'])
Route.post('/updateProfile', 'SiteController.updateProfile').middleware(['auth'])
Route.post('/updatePassword', 'SiteController.updatePassword').middleware(['auth'])
Route.get('/category/:slug', 'SiteController.category')
Route.get('/post/:slug', 'SiteController.more')

Route.on('login').render('site.login')
Route.post('login', 'SiteController.pLogin').validator('Login')

Route.get('logout', 'SiteController.logout').middleware(['auth'])

Route.on('admin').render('admin.index').middleware(['auth'])

/* admin post */
Route.get('/admin/post/create', 'PostController.create').middleware(['auth'])
Route.get('/admin/post/:page?', 'PostController.index').middleware(['auth'])
Route.post('/admin/post/create', 'PostController.store').middleware(['auth']).validator('post')
Route.get('/admin/post/view/:id', 'PostController.view').middleware(['auth'])
Route.get('/admin/post/edit/:id', 'PostController.edit').middleware(['auth'])
Route.post('/admin/post/update/:id', 'PostController.update').middleware(['auth']).validator('post')
Route.get('/admin/post/delete/:id', 'PostController.delete').middleware(['auth'])

/* admin category */
Route.get('/admin/category', 'CategoryController.index').middleware(['auth'])
Route.post('/admin/category/create', 'CategoryController.store').middleware(['auth']).validator('category')
Route.get('/admin/category/create', 'CategoryController.create').middleware(['auth'])
Route.get('/admin/category/view/:id', 'CategoryController.view').middleware(['auth'])
Route.get('/admin/category/edit/:id', 'CategoryController.edit').middleware(['auth'])
Route.post('/admin/category/update/:id', 'CategoryController.update').middleware(['auth']).validator('category')
Route.get('/admin/category/delete/:id', 'CategoryController.delete').middleware(['auth'])

/* comments */
Route.post('/comment/store', 'CommentController.store').validator('Comment')
Route.get('/admin/comments', 'CommentController.index').middleware(['auth'])
Route.get('/admin/comment/delete/:id', 'CommentController.delete').middleware(['auth'])
Route.get('/admin/comment/view/:id', 'CommentController.show').middleware(['auth'])