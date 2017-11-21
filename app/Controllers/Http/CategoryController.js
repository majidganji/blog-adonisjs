'use strict'

const Category = use('App/Models/Category')
const moment = use('moment-jalaali')

class CategoryController {

  async index({view}) {
    const models = await Category.query().orderBy('id', 'desc')
    return view.render('category.index', {
      models: models,
      moment: moment
    })
  }

  async view({view, params, response}) {
    const model = await Category.query().where('id', params.id).first()
    if (model === null){
      response.redirect('/admin/category')
    }
    return view.render('category.view', {
      model: model,
      moment: moment
    })
  }

  async edit({view, params}) {
    const model = await Category.query().where('id', params.id).first()
    return view.render('category.edit', {
      model: model,
    })
  }

  async update({params, request, session, response}) {
    const category = await Category.query().where('id', params.id).first()
    if (category === null) {
      session.withErrors({danger: 'مشکلی در بروزرسانی وجود دارد'}).flashAll()
      return response.redirect('back')
    }
    console.log(request.input('name'), request.input('slug'))
    category.name = request.input('name')
    category.slug = request.input('slug')
    await category.save()
    session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
    return response.redirect('/admin/category/view/' + params.id)
  }

  async delete({params, response, session}) {
    const category = await Category.query().where('id', params.id).first()
    if (await category.delete()) {
      session.withErrors({success: 'با موفقیت حذف شد'}).flashAll()
      response.redirect('/admin/category')
    } else {
      session.withErrors({danger: 'دوباره تلاش کنید'}).flashAll()
      response.redirect('back')
    }
  }

  async create({view}) {
    return view.render('category.create')
  }

  async store({request, response, session}) {
    const category = new Category()
    category.fill(request.only(['name', 'slug']))
    category.merge({
      created_at: new Date().getTime(),
      updated_at: new Date().getTime()
    })
    console.log(category)
    if (!(await category.save())) {
      session.withErrors({danger: 'مشکلی در بروزرسانی وجود دارد'}).flashAll()
      return response.redirect('back')
    }
    session.withErrors({success: 'با موفقیت ذخیره شد'}).flashAll()
    return response.redirect('/admin/category/view/' + category.id)
  }
}

module.exports = CategoryController
