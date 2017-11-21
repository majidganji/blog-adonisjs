'use strict'

const Model = use('Model')

class Post extends Model {
	static boot(){
		super.boot()
		this.addHook('beforeDelete', 'PostHook.beforeDelete')
	}
}

module.exports = Post
