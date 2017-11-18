'use strict'
const Category = use('App/Models/Category')
const moment = use('moment-jalaali')


class CategoryController {
	async index({view}){
		const models = await Category.query().orderBy('id', 'desc')
		return view.render('category.index', {
			models: models,
			moment: moment
		})
	}

	async view({view, params}){
		const model = await Category.query().where('id', params.id).first()
		return view.render('category.view', {
			model: model,
			moment: moment
		})
	}

	async edit({view, params}){
		const model = await Category.query().where('id', params.id).first()
		return view.render('category.edit', {
			model: model,
		})
	}

	async update({view, params, request, session, response}){
        const category = await Category.query().where('id', params.id).update(request.only(['name', 'slug']))
        if(category !== 1){
            session.withErrors({danger: 'مشکلی در بروزرسانی وجود دارد'}).flashAll()
            return response.redirect('back')
        }
        session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
        return response.redirect('/admin/category/view/' + params.id)
	}

	async delete({params, response, session}){
        const category = await Category.query().where('id', params.id).first()
        if (await category.delete()) {
            session.withErrors({success: 'با موفقیت حذف شد'}).flashAll()
            response.redirect('/admin/category')
        }else{
            session.withErrors({danger: 'دوباره تلاش کنید'}).flashAll()
            response.redirect('back')
        }
    }

	async create({view}){
        return view.render('category.create')
    }

	async store({request, response, session}){
        const category = new Category()
        category.fill(request.only(['name', 'slug']))
        if(!await category.save()){
            session.withErrors({danger: 'مشکلی در بروزرسانی وجود دارد'}).flashAll()
            return response.redirect('back')
        }
        session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
        return response.redirect('/admin/category')
    }
}

module.exports = CategoryController
