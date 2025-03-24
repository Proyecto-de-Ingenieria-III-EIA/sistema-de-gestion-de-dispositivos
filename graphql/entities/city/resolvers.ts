import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreateCityInput {
    name: string;
}

const cityResolvers: Resolver = {
    Query: {
        getCities: async (parent, args, { db }) => {
            return await db.city.findMany();
        },
        getCityById: async (parent, { id }: { id: string }, { db }) => {
            const city = await db.city.findUnique({ where: { id } });
            if (!city) {
                throw new GraphQLError('Ciudad no encontrada.');
            }
            return city;
        },
        getCityByName: async (parent, { name }: { name: string }, { db }) => {
            const city = await db.city.findMany({ where: { name } });
            if (!city) {
                throw new GraphQLError('Ciudad no encontrada.');
            }
            return city;
        },
    },
    Mutation: {
        createCity: async (parent, { input }: { input: CreateCityInput }, { db, authData }) => {
            if (authData.role !== 'ADMIN') {
               throw new GraphQLError('No estás autorizado para hacer eso.');
            }
            
            const newCity = await db.city.create({
                data: {
                    name: input.name,
                },
            });
            return newCity;
        },
    },
};

export { cityResolvers };