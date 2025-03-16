import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreateLoanInput {
  deviceIds: string[];
  startDate: Date;
  endDate: Date;
  originCityId: string;
  arrivalCityId: string;
}

interface UpdateLoanStatusInput {
  loanId: string;
  status: 'APPROVED' | 'REJECTED' | 'EXTENDED' | 'PENDING';
  rejectionReason?: string;
}

interface ExtendLoanInput {
  loanId: string;
  newEndDate: Date;
}

const loanResolvers: Resolver = {
  Query: {
    getLoans: async (parent, args, { db, authData }) => {
      return await db.loan.findMany({
        where: { userId: authData.email },
        include: {
          devices: true,
          peripherals: true,
          originCity: true,
          arrivalCity: true,
        },
      });
    },
    getLoanReminders: async (parent, args, { db }) => {
      const now = new Date();
      const soon = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return await db.loan.findMany({
        where: {
          endDate: { gte: now, lte: soon },
          returnDate: null,
        },
      });
    },
  },
  Mutation: {
    createLoan: async (parent, { input }: { input: CreateLoanInput }, { db, authData }) => {
      const activeLoans = await db.loan.count({
        where: {
          userId: authData.email,
          returnDate: null,
        },
      });
      if (activeLoans >= 3) {
        throw new GraphQLError('Límite de 3 préstamos activos alcanzado.');
      }

      if (new Date(input.startDate) >= new Date(input.endDate)) {
        throw new GraphQLError('La fecha de inicio debe ser anterior a la fecha de fin.');
      }

      const newLoan = await db.loan.create({
        data: {
          user: { connect: { email: authData.email } },
          totalPrice: 0, // Cálculo pendiente según las reglas de negocio
          // Utilizamos nested writes para relacionar las ciudades
          originCity: { connect: { id: input.originCityId } },
          arrivalCity: { connect: { id: input.arrivalCityId } },
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          devices: {
            create: input.deviceIds.map((id) => ({
              device: { connect: { id } },
            })),
          },
        },
        include: {
          devices: true,
          originCity: true,
          arrivalCity: true,
        },
      });
      return newLoan;
    },
    updateLoanStatus: async (
      parent,
      { input }: { input: UpdateLoanStatusInput },
      { db, authData }
    ) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para actualizar el estado del préstamo.');
      }
      if (input.status === 'REJECTED' && !input.rejectionReason) {
        throw new GraphQLError('El motivo es obligatorio al rechazar un préstamo.');
      }
      const updatedLoan = await db.loan.update({
        where: { id: input.loanId },
        data: {
          // Actualiza el campo de estado (asegúrate de tener el campo en el modelo Prisma)
          // status: input.status,
          // O agrega la lógica condicional deseada
        },
        include: {
          devices: true,
          originCity: true,
          arrivalCity: true,
          peripherals: true,
        },
      });
      return updatedLoan;
    },
    extendLoan: async (
      parent,
      { input }: { input: ExtendLoanInput },
      { db, authData }
    ) => {
      const loan = await db.loan.findUnique({ where: { id: input.loanId } });
      if (!loan) {
        throw new GraphQLError('Préstamo no encontrado.');
      }
      if (new Date(input.newEndDate) <= loan.endDate) {
        throw new GraphQLError('La nueva fecha debe ser posterior a la fecha de fin actual.');
      }
      const extendedLoan = await db.loan.update({
        where: { id: input.loanId },
        data: {
          endDate: new Date(input.newEndDate),
          // status: 'EXTENDED'
        },
        include: {
          devices: true,
          originCity: true,
          arrivalCity: true,
          peripherals: true,
        },
      });
      return extendedLoan;
    },
  },
};

export { loanResolvers };