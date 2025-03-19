import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreatePeripheralInput {
  serialNumber: string;
  model: string;
  type: 'MOUSE' | 'KEYBOARD' | 'MONITOR' | 'HEADSET' | 'WEBCAM' | 'OTHER';
  brand: string;
  price: number;
  extraInfo?: string;
}

interface UpdatePeripheralInput {
  peripheralId: string;
  serialNumber?: string;
  model?: string;
  type?: 'MOUSE' | 'KEYBOARD' | 'MONITOR' | 'HEADSET' | 'WEBCAM' | 'OTHER';
  brand?: string;
  price?: number;
  extraInfo?: string;
}

const peripheralResolvers: Resolver = {
  Query: {
    getPeripherals: async (parent, args, { db }) => {
      return await db.peripheral.findMany();
    },
    getPeripheralById: async (parent, { id }: { id: string }, { db }) => {
      const peripheral = await db.peripheral.findUnique({ where: { id } });
      if (!peripheral) {
        throw new GraphQLError('Periférico no encontrado.');
      }
      return peripheral;
    },
  },
  Mutation: {
    createPeripheral: async (parent, { input }: { input: CreatePeripheralInput }, { db, authData }) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para agregar un periférico.');
      }
      
      const newPeripheral = await db.peripheral.create({
        data: {
          serialNumber: input.serialNumber,
          model: input.model,
          type: input.type,
          brand: input.brand,
          price: input.price,
          extraInfo: input.extraInfo ?? 'no aplica', // Valor por defecto si no se especifica
          // El campo "removed" se asigna automáticamente por defecto (false) si se define así en el schema de Prisma
        },
      });
      return newPeripheral;
    },
    updatePeripheral: async (parent, { input }: { input: UpdatePeripheralInput }, { db, authData }) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para actualizar periféricos.');
      }

      const existingPeripheral = await db.peripheral.findUnique({ where: { id: input.peripheralId } });
      if (!existingPeripheral) {
        throw new GraphQLError('Periférico no encontrado.');
      }

      const updatedPeripheral = await db.peripheral.update({
        where: { id: input.peripheralId },
        data: {
          serialNumber: input.serialNumber ?? existingPeripheral.serialNumber,
          model: input.model ?? existingPeripheral.model,
          type: input.type ?? existingPeripheral.type,
          brand: input.brand ?? existingPeripheral.brand,
          price: input.price ?? existingPeripheral.price,
          extraInfo: input.extraInfo ?? existingPeripheral.extraInfo,
        },
      });
      return updatedPeripheral;
    },
    deletePeripheral: async (parent, { id }: { id: string }, { db, authData }) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para eliminar periféricos.');
      }
  
      const peripheral = await db.peripheral.findUnique({ where: { id } });
      if (!peripheral) {
        throw new GraphQLError('Periférico no encontrado.');
      }
  
      // Eliminado lógico: marcamos el periférico como eliminado actualizando el campo "removed"
      await db.peripheral.update({
        where: { id },
        data: { removed: true },
      });
      return { message: 'Periférico marcado como eliminado correctamente' };
    },
  },
};

export { peripheralResolvers };
