'use strict'

const Comment = use('App/Models/Comment')
const Post = use('App/Models/Post')
const Moment = use('moment-jalaali')
class CommentController {
  async index ({view}) {
    const comment = await Comment.query().select('comments.*', 'posts.title as title', 'posts.id as post_id').orderBy('comments.id', 'desc').rightJoin('posts', 'comments.post_id', 'posts.id').where('comments.id', '>', 0)
    return view.render('comment.index',{
      models: comment,
      moment: Moment
    })
  }

  async create () {
  }

  async store ({request, response, session}) {
    const post = await Post.firstOrFail(request.input('post_id'))
    const comment = new Comment()
    comment.fill(request.only(['name', 'email', 'body']))
    comment.merge({
      post_id: post.id,
      parent_id: null
    })
    if (await comment.save()){
      session.withErrors({success: 'نظر شما با موفقیت درج شد، بعد از تایید نمایش داده می شود'}).flashAll()
    }else{
      session.withErrors({danger: 'خطا: لطفا دوباره تلاش کنید'}).flashAll()
    }
    return response.redirect('back')
  }

  async show ({params, view, response}) {
    const comment = await Comment.query().select('comments.*', 'posts.title as title', 'posts.id as post_id').orderBy('comments.id', 'desc').rightJoin('posts', 'comments.post_id', 'posts.id').where('comments.id',params.id).firstOrFail()
    return view.render('comment.show',{
      model: comment,
      moment: Moment
    })
  }

  async edit () {
  }

  async update () {
  }

  async delete ({params, response}) {
    const comment = await Comment.firstOrFail(params.id)
    await comment.delete()
    return response.redirect('/admin/comments')
  }
}

module.exports = CommentController
