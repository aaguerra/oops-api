const path = require('path')
const _ = require('lodash')
const ROOT = path.resolve(__dirname, '../')
require('dotenv').config({ path: path.join(ROOT, '.env') })
const {apolloServerAuth,apolloServerOpen} = require('./grahpql')


const NODE_ENV = _.defaultTo(process.env.NODE_ENV, 'development')

const isProd = NODE_ENV === 'production'
const isTest = NODE_ENV === 'test'
const isDev = NODE_ENV === 'development'
module.exports = { 
  apolloServerAuth : apolloServerAuth,
  apolloServerOpen : apolloServerOpen,
  server: {
    port: normalizePort(_.defaultTo(process.env.PORT, 3000)),
    host: _.defaultTo(process.env.HOST, 'localhost'),
    root: ROOT,
    data: path.join(ROOT, '../', '/data')
  },

  env: {
    isDev,
    isProd,
    isTest
  },

  cors: {
    origin: '*',
    exposeHeaders: ['Authorization'],
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: ['Authorization', 'Content-Type'],
    keepHeadersOnError: true
  },

  bodyParser: {
    enableTypes: ['json']
  },

  //db: db,

  secret: _.defaultTo(process.env.SECRET, 'secret'),

  jwtSecret: _.defaultTo(process.env.JWT_SECRET, 'secret'),

  jwtOptions: {
    expiresIn: '7d'
  }
}

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}