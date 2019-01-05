const { jwtSecret, jwtOptions } = require('config')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

function generateJWTforRefresh (user = {}) {
  var data = _.pick(user, ['id', 'username'])
  data.fecha = Date.now();
  return  jwt.sign({
      data:  data
    }, _.defaultTo(process.env.JWT_SECRET, 'secret1'), jwtOptions)
}

function generateJWTfoAccess (user = {}) {
  return jwt.sign({//Math.floor(Date.now() / 1000) + (60 * 60) una hora
      exp: Math.floor(Date.now() / 1000) + (60*60) ,//5 segundos
      data:  _.pick(user, ['id', 'username'])
    }, _.defaultTo(process.env.JWT_SECRET, 'secret1'), jwtOptions)
}

function generateJWTforUser (user = {}) {
  console.log(_.defaultTo(process.env.JWT_SECRET, 'secret1'))
  return Object.assign({}, user, {
    token: jwt.sign({
      sub: _.pick(user, ['id', , 'username'])
    }, _.defaultTo(process.env.JWT_SECRET, 'secret1'), jwtOptions)
  })
}

function getSelect (table, prefix, fields) {
  return fields.map(f => `${table}.${f} as ${prefix}_${f}`)
}

exports.generateJWTforUser = generateJWTforUser
exports.generateJWTforRefresh = generateJWTforRefresh
exports.generateJWTfoAccess = generateJWTfoAccess
exports.getSelect = getSelect