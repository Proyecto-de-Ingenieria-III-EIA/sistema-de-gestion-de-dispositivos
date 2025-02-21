import { resolvers, types } from '@/graphql';
import { prisma } from '@/prisma';
import { Context, AuthData } from '@/types';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { NextApiRequest, NextApiResponse } from 'next';

export const schema = makeExecutableSchema({ typeDefs: types, resolvers });

const server = new ApolloServer<Context>({
  schema,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers['session-token'];

    const authData = (await prisma.$queryRaw`
    select 
    u.email,
    r."name" as "role",
    s.expires
    from "Session" s
        join "User" u
            on s."userId" = u.id
        join "Role" r
            on u."roleId" = r.id
    where s."sessionToken" = ${token}
    `) as AuthData[];

    return {
      db: prisma,
      authData: authData[0],
    };
  },
});