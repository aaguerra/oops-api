//https://github.com/motdotla/dotenv
// para cargar variables de entorno de un archivo .env
require('dotenv').config()
require('../config/mongooseDb')
const { apolloServerAuth,apolloServerOpen, server: { port, host }} = require('../config')

const app = require('../app')

//graphql config
apolloServerAuth.applyMiddleware({ app,path: process.env.GRAPHQL_PATH_AUTH });
apolloServerOpen.applyMiddleware({ app,path: process.env.GRAPHQL_PATH_OPEN });

//console.log(app.db)

process.once('SIGINT', () => app.shutDown())
process.once('SIGTERM', () => app.shutDown())

app.server.listen( port, host)

app.server.on('error', onError)
app.server.on('listening', onListening)

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

function onListening () {
  var addr = app.server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  console.log('🚀 Listening on ' + bind)  
  console.log(`🚀 Server ready at http://localhost:3000${apolloServerAuth.graphqlPath}`)
  console.log(`🚀 Server ready at http://localhost:3000${apolloServerOpen.graphqlPath}`)
}

