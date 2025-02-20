import { resolvers, types } from '@/graphql';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

interface Context {
  db: PrismaClient;
}

const server = new ApolloServer<Context>({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async () => {
    return {
      db: prisma,
    };
  },
});