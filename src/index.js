require('dotenv').config();
const { GraphQLServer } =  require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query =  require('./resolvers/Query');
const Mutation =  require('./resolvers/Mutation');
//const Subscription =  require('./resolvers/Subscription');
/*
const resolvers = {
    Query,
    Mutation,
    Subscription
}
*/


const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: './src/schema.graphql',
            endpoint: 'https://us1.prisma.sh/ele-l-b813df/insta_backend/dev',
            debug:true
        })
    }),
    resolverValidationOptions:{
        requireResolversForResolveType:false
    }
});

module.exports = {
    server
};