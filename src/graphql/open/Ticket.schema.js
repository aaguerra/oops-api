const TicketModel = require('../../db/ticket');
const UserModel = require('../../db/user');
const { generateJWTfoAccess,generateJWTforRefresh,generateJWTforUser } = require('../../lib/utils')

const typeDefinitions = `
  # Esto es un curso en nuestro sistema
  type Ticket {
    id : ID
    access_token: String
    refresh_token: String
    info: String
    status: Int
    expires_in: Float
  }

  input Loguin {
    username: String!
    password: String!
  }

`

const queries = `
refreshToken (token: String): Ticket
`

const mutations = `
  loguinUser( user  : Loguin ): Ticket
` 

const resolvers = {
  Query: {
    refreshToken: async (_, args) => {
      await TicketModel.findById(args.id)
    }
  },
  Mutation: {
    loguinUser: async (_, args) => {
      var response = null
      console.log(args.user.username )
      var user = await UserModel.findOne({ _id: args.user.username }, function (err, adventure) {});
      console.log(user)
      if (!user) {
        response = {
          id: "",
          access_token: "",
          refresh_token: "",
          expires_in: 0,
          info: "El usuario no existe",
          status: -1
        }
      } else if(user.password === args.user.password) {
        console.log(generateJWTforUser(user))
        response = {
          id: user._id,
          access_token: generateJWTfoAccess(user),
          refresh_token: generateJWTforRefresh(user),
          expires_in: Math.floor(Date.now() / 1000) + (5),
          info: "",
          status: 1
        }
      } else {
        response = {
          id: "",
          access_token: "",
          refresh_token: "",
          expires_in: 0,
          info: "Clave incorrecta",
          status: -1
        }
      }
      
      return response
    },
  },
}

module.exports = {
  typeDefinitions,
  queries,
  resolvers,
  mutations
}