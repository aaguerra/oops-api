
const glob = require('glob')
const path = require('path')

let typeDefs = []
let allQueries = []
let allResolvers = { Query: {}, Mutation: {} }//{ Query: {} }//
let allMutations = []


// Search for files with the name 'schema'
const schemas = glob.sync(`${__dirname}/*schema.js`)

schemas.forEach(file => {
  // Require each file
  let { typeDefinitions, queries, resolvers, mutations } = require(path.resolve(file))

  typeDefs.push(typeDefinitions)
  allMutations.push(mutations || '')
  allQueries.push(queries)
  
  Object.keys(resolvers).forEach(key => {
    
    if(!allResolvers[key])
      allResolvers[key] = {}
      
    Object.assign(allResolvers[key], resolvers[key])
    
  })

})

const mergedSchema =  `
${typeDefs.join('\r')}

type Query {
  ${allQueries.join('\r')}
}

type Mutation {
  ${allMutations.join('\r')}
}

`/*

*/

//agregando una busqueda al resolver basada en una union 
//definida en profesor.schema.js
/*allResolvers.ResultadoBusqueda= {
  __resolveType: (obj) => {
    console.log(obj)
    if(obj.nombre) return 'Profesor'
    return 'Curso'
  }
}*/

module.exports = { mergedSchema ,  allResolvers  }