'use strict'

const Schema = use('Schema')

class PostSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('title').notNullable()
      table.string('slug').notNullable().unique()
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.string('description')
      table.text('body', 'longtext')
      table.timestamps()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostSchema
