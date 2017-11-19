'use strict'

const {validate} = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')
const Post = use('App/Models/Post')
const moment = use('moment-jalaali')
const Category = use('App/Models/Category')
const Redis = use('Redis')

class SiteController {
    
    async index({view}){
        let models = JSON.parse(await Redis.get('post_list'))
        if (!models) {
            models = await Post.query().select('posts.*', 'categories.name as cateName', 'categories.slug as cateSlug' ).orderBy('posts.id', 'desc').rightJoin('categories', 'posts.category_id', 'categories.id').where('posts.id', '>' , 0)
            if (models) {
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
        if(user){
            passwordOk = await Hash.verify(request.input('password'), user.password)
        }
        if(!user || !passwordOk){
            session.withErrors([{field: 'password', message: 'نام کاربری یا رمز عبور نادرست است'}]).flashAll()
            return response.redirect('back')
        }
        await auth.login(user)
        return response.redirect('/')
    }

    async logout({auth, response}){
        await auth.logout()
        response.redirect('/')
    }

    async categoryList(){
        const cache = await Redis.get('category_list')
        if (cache) {
            // return JSON.parse(cache)
        }
        const categories =  await Category.query().select(['name', 'slug']).fetch()
        console.log(categories.rows !== [])
        if (categories) {
            await Redis.set('category_list', JSON.stringify(categories))
        }
        return categories
    }

    async more({params, view}){
        const post = await Post.query().select('posts.*', 'categories.name as cateName', 'categories.slug as cateSlug' ).orderBy('posts.id', 'desc').rightJoin('categories', 'posts.category_id', 'categories.id').where('posts.slug', params.slug).first()
        return view.render('site.more', {
            model: post,
            moment: moment
        })
    }

    async category({params, view}){
        let category = JSON.parse(await Redis.get('category' + params.slug))
        if (!category) {
            category = await Category.query().where('slug', params.slug).first()
            if (category) {
                await Redis.set('category' + params.slug, JSON.stringify(category))
            }
        }

        let posts = JSON.parse(await Redis.get('pcategory' + params.slug))
        if (!posts) {
            posts = await Post.query().where('category_id', category.id).orderBy('id', 'desc')
            if (posts) {
                await Redis.set('pcategory' + params.slug, JSON.stringify(posts))
            }
        }

        return view.render('site.category', {
            category: category,
            models: posts,
            moment: moment
        })
    }
}

module.exports = SiteController
