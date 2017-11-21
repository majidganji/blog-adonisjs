'use strict'

const PostHook = exports = module.exports = {}
const Comment = use('App/Models/Comment')
PostHook.beforeDelete = async (modelInstance) => {
	await Comment.query().where('post_id', modelInstance.id).delete()
}
