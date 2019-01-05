
const { ApolloServer, gql } = require('apollo-server-koa');
const _ = require('lodash')
const NODE_ENV = _.defaultTo(process.env.NODE_ENV, 'development')

const UserModel = require('../db/user');

const graphqlAuth = require('../graphql/auth')
const graphqlOpen = require('../graphql/open')

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: async (obj, args, ctx, info) => {  
    //let user = new ctx.db.User({ name: 'Silence' });
    /*user.password = args.password || user.password;
    user.firstName = args.firstName || user.firstName;
    user.lastName = args.lastName || user.lastName;
    user.age = args.age || user.age;*/
    let doc = {
      username: 'juan',
      password: "dasiwoyebushuo",
      
    };

    let user =  new UserModel(doc)
      try {
        let savedUser = await user.save();   
      } catch (e) {
        console.log(e);
      }
      return 'hola prueba mama'
    },
    //hello: () => 'Hello world!',
  },
};

const apolloServerAuth = NODE_ENV === 'production' ? new ApolloServer({
    typeDefs:graphqlAuth.mergedSchema, resolvers:graphqlAuth.allResolvers
      ,context: ({ ctx }) => ({ ctx }) , introspection: false, playground: false,
    }) : new ApolloServer({ typeDefs:graphqlAuth.mergedSchema, resolvers:graphqlAuth.allResolvers ,context: ({ ctx }) => ({ ctx }) });

const apolloServerOpen = NODE_ENV === 'production' ? new ApolloServer({
    typeDefs:graphqlOpen.mergedSchema, resolvers:graphqlOpen.allResolvers
      ,context: ({ ctx }) => ({ ctx }) , introspection: false, playground: false,
    }) : new ApolloServer({ typeDefs:graphqlOpen.mergedSchema, resolvers:graphqlOpen.allResolvers ,context: ({ ctx }) => ({ ctx }) });


module.exports = {
  apolloServerAuth,apolloServerOpen
}
