'use strict'

class Login {
  get rules () {
    return {
      username: 'required',
      password: 'required'
    }
  }
}

module.exports = Login
