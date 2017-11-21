'use strict'

const Schema = use('Schema')

class CommentSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.integer('post_id').unsigned().references('id').inTable('posts')
      table.integer('parent_id').unsigned().references('id').inTable('comments')
      table.string('name')
      table.string('email')
      table.text('body', 'longText')
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentSchema
