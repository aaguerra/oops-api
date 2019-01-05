const koaJwt = require('koa-jwt')
const { jwtSecret } = require('config')
const TicketModel = require('../../db/ticket');
//https://github.com/superman66/koa-jwt-sample

const validateToken = async function (token) {
  let token = await TicketModel.findOne({ access_token: args.token }, function (err, adventure) {});
  return (token)? true: false
}
module.exports = koaJwt({
  getToken (ctx, opts) {
    const { authorization } = ctx.header
    var token = ""
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      token = authorization.split(' ')[1]
      return validateToken(token)
    }

    if (authorization && authorization.split(' ')[0] === 'Token') {
      token = authorization.split(' ')[1]
      return validateToken(token)
    }

    return null
  },
  secret: jwtSecret,
  passthrough: false,
  key: 'jwt'
})