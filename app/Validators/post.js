'use strict'

class post {
  get rules () {
    return {
      title: 'required',
      slug: 'required',
      category_id: 'required|exists:categories,id',
      description: 'required',
      body: 'required'
    }
  }
}

module.exports = post
