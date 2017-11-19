'use strict'

const Category = use('App/Models/Category')
const Post = use('App/Models/Post')
const moment = use('moment-jalaali')
moment.locale('fa')

class PostController {
    
    async index({request, view, params}){
    	const page = params.page || 1
    	const models = await Post.query().select('posts.*', 'categories.name as cateName').orderBy('posts.id', 'desc').rightJoin('categories', 'posts.category_id', 'categories.id').where('posts.id', '>' , 0)
        return view.render('post.index', {
        	models: models,
        	moment: moment
        })
    }
    
    async create({view}){
    	const categories = await Category.query()
    	return view.render('post.create', {
    		categories: categories
    	})
    }

    async store({request, response, auth, session}){
        const post = new Post()
        post.fill(request.only(['title', 'slug', 'description', 'body', 'category_id']))
        post.merge({
            user_id: auth.user.id,
            created_at: new Date(),
            updated_at: new Date()
        })
    	await post.save()
    	session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
    	return response.redirect('/admin/post')
    }

    async view({response, params, view}){
        const post = await Post.query().select('posts.*', 'categories.name', 'categories.id as cateId').where('posts.id', params.id).rightJoin('categories', 'posts.category_id', 'categories.id').first()
        return view.render('post.view', {
            model: post,
            moment: moment
        })
    }

    async edit({params, view, response}){
        const model = await Post.query().select('posts.*', 'categories.id as cateId').where('posts.id', params.id).rightJoin('categories', 'posts.category_id', 'categories.id').first()
        const category = await  Category.query()
        return view.render('post.edit', {
            model: model,
            categories: category
        })
    }

    async update({request, response, session, params}){
        const post = await Post.query().where('id', params.id).update(request.only(['title', 'slug', 'description', 'body', 'category_id']))
        if(post !== 1){
            session.withErrors({danger: 'مشکلی در بروزرسانی وجود دارد'}).flashAll()
            return response.redirect('back')
        }
        session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
        return response.redirect('/admin/post/view/' + params.id)
    }

    async delete({params, response, session}){
        const post = await Post.query().where('id', params.id).first()
        if (await post.delete()) {
            session.withErrors({success: 'با موفقیت حذف شد'}).flashAll()
            response.redirect('/admin/post')
        }else{
            session.withErrors({danger: 'دوباره تلاش کنید'}).flashAll()
            response.redirect('back')
        }
    }
}

module.exports = PostController
