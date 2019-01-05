const config = require('config')
const http = require('http')
const Koa = require('koa')
const path = require( 'path')
const serve = require('koa-static');

const app = new Koa()

app.keys = [config.secret]

//se usa Yup, es un validador de esquema de objetos JavaScript y un analizador de objetos
//require('schemas')(app)

const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
//const camelizeMiddleware = require('middleware/camelize-middleware')
const error = require('middleware/error-middleware')
const cors = require('kcors')
const jwt = require('middleware/jwt-middleware')
const bodyParser = require('koa-bodyparser')
//const pagerMiddleware = require('middleware/pager-middleware')
//const userMiddleware = require('middleware/user-middleware')
const routes = require('routes')

if (!config.env.isTest) {
  app.use(responseTime())
  app.use(helmet())
}

app.use(logger())

//app.use(camelizeMiddleware)

app.use(error)

app.use(cors(config.cors))
app.use(jwt.unless({ path: [/^\/open/,/^\/api/] }));
app.use(bodyParser(config.bodyParser))

//app.use(userMiddleware)
//app.use(pagerMiddleware)

app.use(routes.routes())
app.use(routes.allowedMethods())

app.server = require('http-shutdown')(http.createServer(app.callback()))


// agregando carpeta con archivos staticos
app.use(serve(path.resolve('dist'))) 


app.shutDown = function shutDown () {
  let err

  console.log('Shutdown')

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error)
        err = error
      }

      this.db.destroy()
        .catch(error => {
          console.error(error)
          err = error
        })
        .then(() => process.exit(err ? 1 : 0))
    })
  }
}



module.exports = app