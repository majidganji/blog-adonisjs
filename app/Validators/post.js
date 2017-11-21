'use strict'

class post {
  get rules () {
    return {
      title: 'required',
      slug: 'required',
      category_id: 'required|exists:categories,id',
      description: 'required|max:250',
      body: 'required'
    }
  }
}

module.exports = post
