const config = require('config')

module.exports = function (app) {

  /*app.db = config.db.start();
  app.context.db= app.db
  console.log(app.db)*/
  return async function (ctx, next) {
    /*if (ctx.app.migration && promise) {
      await promise
    }*/    

    return next()
  }
}