import { PrismaClient, Enum_RoleName } from '@prisma/client';

interface AuthData {
  email: string;
  role: Enum_RoleName;
  expires: Date;
}

interface Context {
  db: PrismaClient;
  authData: AuthData;
}

interface ResolverFunction {
  [key: string]: (parent: any, args: any, context: Context) => Promise<any>;
}

interface Resolver {
  Query: ResolverFunction;
  Mutation: ResolverFunction;
  [key: string]: ResolverFunction;
}

export type { Resolver, Context, AuthData };