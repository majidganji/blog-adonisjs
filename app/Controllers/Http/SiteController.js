'use strict'

const {validate} = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')
const Post = use('App/Models/Post')
const moment = use('moment-jalaali')
const Category = use('App/Models/Category')
const Redis = use('Redis')
const Comments = use('App/Models/Comment')

class SiteController {

  async index({view}) {
    let models = JSON.parse(await Redis.get('post_list'))
    if (!models || models.length === 0) {
      models = await Post.query().select('posts.*', 'categories.name as cateName', 'categories.slug as cateSlug').orderBy('posts.id', 'desc').rightJoin('categories', 'posts.category_id', 'categories.id').where('posts.id', '>', 0).fetch()
      models = models.rows
      if (models.length !== 0) {
        await Redis.set('post_list', JSON.stringify(models))
      }
    }
    return view.render('site.index', {
      models: models,
      moment: moment
    })
  }

  async pLogin({request, auth, session, response}) {
    const user = await User.query().where({username: request.input('username')}).first()
    let passwordOk;
    if (user) {
      passwordOk = await Hash.verify(request.input('password'), user.password)
    }
    if (!user || !passwordOk) {
      session.withErrors([{field: 'password', message: 'نام کاربری یا رمز عبور نادرست است'}]).flashAll()
      return response.redirect('back')
    }
    await auth.login(user)
    return response.redirect('/')
  }

  async logout({auth, response}) {
    await auth.logout()
    response.redirect('/')
  }

  async categoryList() {
    const cache = JSON.parse(await Redis.get('category_list'))
    if (cache && cache.length !== 0) {
      return cache
    }
    const categories = await Category.query().select(['name', 'slug']).fetch()
    if (categories && categories.rows.length !== 0) {
      await Redis.set('category_list', JSON.stringify(categories.rows))
    }
    return categories.rows
  }

  async more({params, view}) {
    const post = await Post.query().select('posts.*', 'categories.name as cateName', 'categories.slug as cateSlug').orderBy('posts.id', 'desc').rightJoin('categories', 'posts.category_id', 'categories.id').where('posts.slug', params.slug).firstOrFail()
    const comments = await Comments.query().where('post_id', post.id)
    console.log(comments)
    return view.render('site.more', {
      model: post,
      comments:comments,
      moment: moment
    })
  }

  async category({params, view}) {
    let category = JSON.parse(await Redis.get('category' + params.slug))
    if (!category || category.length === 0) {
      category = await Category.query().where('slug', params.slug).first()
      if (category && category.length !== 0) {
        await Redis.set('category' + params.slug, JSON.stringify(category))
      }
    }

    let posts = JSON.parse(await Redis.get('pcategory' + params.slug))
    if (!posts || posts.length === 0) {
      posts = await Post.query().where('category_id', category.id).orderBy('id', 'desc').fetch()
      posts = posts.rows
      if (posts.length !== 0) {
        await Redis.set('pcategory' + params.slug, JSON.stringify(posts))
      }
    }

    return view.render('site.category', {
      category: category,
      models: posts,
      moment: moment
    })
  }

  async about({view}){
    return view.render('site.about')
  }

  async profile({view}){
    return view.render('site.profile')
  }

  async updateProfile({request, auth, session, response}){
    const user = await User.query().where('id', auth.user.id).update({username: request.input('username'), email: request.input('email')})
    if (user === 1){
      session.withErrors({success: 'با موفقیت تغییرات ثبت شد'}).flashAll()
      return response.redirect('/logout')
    }else{
      session.withErrors({danger: 'خطا لطفا دوباره امتحان کنید'}).flashAll()
      return response.redirect('back')
    }
    return 'test'
  }

  async updatePassword({request, auth, session, response}){
    const pass = request.input('password')
    const rePass = request.input('repassword')

    if (pass !== rePass){
      session.withErrors({'repassword': 'تکرار رمز عبور درست نیست'}).flashAll()
      return response.redirect('back')
    }

    const user = await User.query().where('id', auth.user.id).update({password: await Hash.make(request.input('password'))})
    if (user === 1){
      session.withErrors({success: 'با موفقیت تغییرات ثبت شد'}).flashAll()
      return response.redirect('/logout')
    }else{
      session.withErrors({danger: 'خطا لطفا دوباره امتحان کنید'}).flashAll()
      return response.redirect('back')
    }
  }
}

module.exports = SiteController
