const TicketModel = require('../../db/ticket');
const jwt = require('jsonwebtoken')
const UserModel = require('../../db/user');
const {jwtSecret} = require('config')
const func = require('lodash')
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
      try {
        var decoded = jwt.verify(args.token, func.defaultTo(process.env.JWT_SECRET, 'secret1'));
        let token = await TicketModel.findOne({ refresh_token: args.token }, function (err, adventure) {});
        if(!token){
          return {
            id: "",
            access_token: "",
            refresh_token: "",
            expires_in: 0,
            info: "Token no existe",
            status: -1
          }
        }          
        token.access_token= generateJWTfoAccess(decoded.data)
        token.refresh_token= generateJWTforRefresh(decoded.data)
        return token
      } catch(err) {
        console.log(err)
        return {
          id: "",
          access_token: "",
          refresh_token: "",
          expires_in: 0,
          info: "Token invalido",
          status: -1
        }
      }
    }
  },
  Mutation: {
    loguinUser: async (_, args) => {
      var response = null
      var user = await UserModel.findOne({ _id: args.user.username }, function (err, adventure) {});
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
        let ticket =  new TicketModel({
          usuario_id: user._id,
          access_token: generateJWTfoAccess(user),
          refresh_token: generateJWTforRefresh(user),
        })
        try {
          await ticket.save();   
        } catch (e) {
          console.log(e);
        }
        response = {
          id: user._id,
          access_token: ticket.access_token,
          refresh_token: ticket.refresh_token,
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