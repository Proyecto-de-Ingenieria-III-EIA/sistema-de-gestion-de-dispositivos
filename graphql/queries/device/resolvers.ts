import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreateDeviceInput{
    serialNumber: string;
    brand: string;
    model: string;
    extraInfo?: string;
    price: number;
    category: 'LAPTOP' | 'PC' | 'MOBILE' | 'TABLET';
}

interface UpdateDeviceInput {
    deviceId: string;
    serialNumber?: string;
    brand?: string;
    model?: string;
    extraInfo?: string;
    price?: number;
    category?: 'LAPTOP' | 'PC' | 'MOBILE' | 'TABLET';
  }

  const deviceResolvers: Resolver = {
    Query: {
      getDevices: async (parent, args, { db }) => {
        return await db.device.findMany();
      },
      getDeviceById: async (parent, { id }: { id: string }, { db }) => {
        const device = await db.device.findUnique({ where: { id } });
        if (!device) {
          throw new GraphQLError('Dispositivo no encontrado.');
        }
        return device;
      },
    },
    Mutation: {
      createDevice: async (parent, { input }: { input: CreateDeviceInput }, { db, authData }) => {
        if (authData.role !== 'ADMIN') {
          throw new GraphQLError('No autorizado para agregar un dispositivo.');
        }
  
        const newDevice = await db.device.create({
          data: {
            serialNumber: input.serialNumber,
            brand: input.brand,
            model: input.model,
            extraInfo: input.extraInfo ?? 'no aplica',  //si no se especifica este campo, por defecto se pone "no aplica"
            price: input.price,
            category: input.category,
          },
        });
  
        return newDevice;
      },
      updateDevice: async (parent, { input }: { input: UpdateDeviceInput }, { db, authData }) => {
        if (authData.role !== 'ADMIN') {
          throw new GraphQLError('No autorizado para actualizar dispositivos.');
        }
  
        const existingDevice = await db.device.findUnique({ where: { id: input.deviceId } });
        if (!existingDevice) {
          throw new GraphQLError('Dispositivo no encontrado.');
        }
  
        const updatedDevice = await db.device.update({
          where: { id: input.deviceId },
          data: {
            serialNumber: input.serialNumber ?? existingDevice.serialNumber,
            brand: input.brand ?? existingDevice.brand,
            model: input.model ?? existingDevice.model,
            extraInfo: input.extraInfo ?? existingDevice.extraInfo,
            price: input.price ?? existingDevice.price,
            category: input.category ?? existingDevice.category,
          },
        });
  
        return updatedDevice;
      },
      deleteDevice: async (parent, { id }: { id: string }, { db, authData }) => {
        if (authData.role !== 'ADMIN') {
          throw new GraphQLError('No autorizado para eliminar dispositivos.');
        }
      
        const device = await db.device.findUnique({ where: { id } });
        if (!device) {
          throw new GraphQLError('Dispositivo no encontrado.');
        }
      
        await db.device.update({
          where: { id },
          data: { removed: true },
        });
        return { message: 'Dispositivo marcado como eliminado correctamente' };
      },
    },
  };
  
  export { deviceResolvers };