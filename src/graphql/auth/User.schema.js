const UserModel = require('../../db/user');

const typeDefinitions = `
  # Esto es un curso en nuestro sistema
  type User {
    id : ID
    username: String!
    password: String!
    email:String
  }


  input NuevoUser {
    username: String!
    password: String!
  }

  input UserEditable {
    username: String!
    password: String!
    token: String
    email:String
  }
`

const queries = `
  usuarios: [User]
  user(id: String): User
`

const mutations = `
  userAdd   ( user  : NuevoUser ): User
` 

const resolvers = {
  Query: {
    usuarios: async () =>  {
      var data = await UserModel.find({})
      data.id = data._id
      return data
    },
    user: async (_, args) => await UserModel.findById(args.id),
  },
  Mutation: {
    userAdd: async (_, args) => {
      let user =  new UserModel(args)
      try {
        let savedUser = await user.save();   
        return savedUser
      } catch (e) {
        console.log(e);
      }
    },
  },
}

module.exports = {
  typeDefinitions,
  queries,
  resolvers,
  mutations
}