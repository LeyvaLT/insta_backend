const { GraphQLServer } =  require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Query =  require('./resolvers/Query');
const Mutation =  require('./resolvers/Mutation');

const PRISMA_ENDPOINT = process.env.PRISMA_ENDPOINT || 'https://us1.prisma.sh/ele-l-b813df/insta_backend/dev';

const resolvers = {
    Query,
    Mutation
};

const server = new GraphQLServer({
    typeDefs:'./src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: process.env.PRISMA_ENDPOINT,
            debug:true
        })
    }),
    resolverValidationOptions:{
        requireResolversForResolveType:false
    }
});

module.exports = server;
