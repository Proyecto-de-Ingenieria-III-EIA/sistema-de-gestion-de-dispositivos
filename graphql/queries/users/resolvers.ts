
import { PrismaClient, User } from '@prisma/client';

interface UserByEmailInput {
  email: string;
}

const userResolvers = {
  User: {
    sessions: async (parent: User, args, { db }) => {
      return await db.session.findMany({
        where: {
          userId: parent.id,
        },
      });
    },
    role: async (parent: User, args, { db }: { db: PrismaClient }) => {
      const role = await db.$queryRaw`
      select r.* from ejemplo_proyecto."Role" r
        join ejemplo_proyecto."User" u
            on u."roleId" = r.id
      where u.id = ${parent.id}
      `;

      return role[0];
    },
  },
  Query: {
    getUsers: async (parent, args, { db }) => {
      return await db.user.findMany();
    },
    getUserByEmail: async (parent, args: UserByEmailInput, { db }) => {
      return await db.user.findUnique({
        where: {
          email: args.email,
        },
      });
    },
  },
  Mutation: {
    updateUserRole: async (parent, args, { db }: { db: PrismaClient }) => {
      console.log(args);

      const role = await db.role.findFirst({
        where: {
          name: args.name,
        },
      });

      return db.user.update({
        where: {
          id: args.id,
        },
        data: {
          roleId: role.id,
        },
      });
    },
  },
};

export { userResolvers };
