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

interface GetDevicesByCityInput{
    cityName: string;
    date?: Date;
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
      getDevicesByCity: async (parent, {input}: {input: GetDevicesByCityInput}, { db }) => {
        const city = await db.city.findFirst({ where: { name: input.cityName } });
        if (!city) {
          throw new GraphQLError('Ciudad no encontrada.');
        }
        let loansByCity;
        if(input.date){
          loansByCity = await db.loan.findMany({
            where: { arrivalCityId: city.id},
          }).then((loans) => loans.filter((loan) => input.date !== undefined && loan.startDate <= input.date && loan.endDate >= input.date));
        } else{
          loansByCity = await db.loan.findMany({
            where: { arrivalCityId: city.id },
          });
        }
        if (loansByCity.length === 0) {
          throw new GraphQLError('No hay préstamos en esta ciudad.');
        }
        const deviceIdsByCityPromises = loansByCity.map(
          async (loan) => await db.loanDevice.findMany({ where: { loanId: loan.id } })
        );
        const deviceIdsByCityResults = await Promise.all(deviceIdsByCityPromises);
        if (deviceIdsByCityResults.length === 0) {
          throw new GraphQLError('No hay dispositivos en esta ciudad.');
        }
        const deviceIdsByCity = deviceIdsByCityResults.flat().map((loanDevice) => loanDevice.deviceId);
        if (deviceIdsByCity.length === 0) {
          throw new GraphQLError('No hay dispositivos en esta ciudad.');
        }
        let devicesByCity;          
        if(input.category){
          devicesByCity = await db.device.findMany({
            where: {
              id: { in: deviceIdsByCity },
              category: input.category,
            },
          });
        } else{
          devicesByCity = await db.device.findMany({
            where: { id: { in: deviceIdsByCity } },
          });
        }
        if (devicesByCity.length === 0) {
          throw new GraphQLError('No se encontraron dispositivos.');
        }

        return devicesByCity;
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
      
        // Verifica si el dispositivo está en préstamo activo con estado PENDING, APPROVED o EXTENDED
        const activeLoan = await db.loanDevice.findFirst({
          where: {
            deviceId: id,
            loan: { is: { status: { in: ['PENDING', 'APPROVED', 'EXTENDED'] } } },
          },
        });
      
        if (activeLoan) {
          throw new GraphQLError('El dispositivo está en préstamo activo y no se puede eliminar.');
        }
      
        await db.device.update({
          where: { id },
          data: { removed: true },
        });
        return { message: 'Dispositivo marcado como eliminado correctamente' };
      }
      ,
    },
  };
  
  export { deviceResolvers };