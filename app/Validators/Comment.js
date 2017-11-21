'use strict'

class Comment {
  get rules () {
    return {
      name: 'required',
      email: 'required|email',
      body: 'required',
      post_id: 'required|exists:posts,id',
      parent_id: 'exists:comments,id'
    }
  }
}

module.exports = Comment
