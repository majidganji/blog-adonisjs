'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class HandlerException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
	async handle (error, { response }) {
		if (error.code === 'EBADCSRFTOKEN') {
			response.forbidden('Cannot process your request.')
			return
		}
	}
}

module.exports = HandlerException
