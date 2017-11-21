'use strict'

const Model = use('Model')

class Category extends Model {
	static boot () {
    super.boot()

    /**
     * A hook to bash the user password before saving
     * it to the database.
     *
     * Look at `app/Models/Hooks/User.js` file to
     * check the hashPassword method
     */
    this.addHook('beforeDelete', 'CategoryHook.deleteForRelation')
  }
}

module.exports = Category
