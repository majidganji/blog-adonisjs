'use strict'

const PostHook = exports = module.exports = {}

PostHook.updateTime = async (modelInstance) => {
	if (modelInstance.updated_at) {
    	modelInstance.updated_at = new Date()
  	}
}
