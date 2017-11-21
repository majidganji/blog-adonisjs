'use strict'

const CategoryHook = exports = module.exports = {}
const Post = use('App/Models/Post')

CategoryHook.deleteForRelation = async (modelInstance) => {
	await Post.query().where('category_id', modelInstance.id).delete()
}
