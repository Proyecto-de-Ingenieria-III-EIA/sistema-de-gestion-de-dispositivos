import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';
import { Enum_RoleName, PrismaClient, Role, User } from '@prisma/client';
import { get } from 'http';

interface CreateTicketInput {
  technicianId: any;
  subject: string;
  description: string;
  loanId: string;
  deviceId: string;
}

interface CloseTicketInput {
  ticketId: string;
}

const ticketResolvers: Resolver = {
  Query: {
    getTickets: async (parent, args, { db }) => {
      return await db.ticket.findMany();
    },
    getTicketById: async (parent, { id }: { id: string }, { db }) => {
      const ticket = await db.ticket.findUnique({ where: { id } });
      if (!ticket) {
        throw new GraphQLError('Ticket no encontrado.');
      }
      return ticket;
    },
    getTicketsByLoanId: async (parent, { loanId }: { loanId: string }, { db }) => {
      const tickets = await db.ticket.findMany({ where: { loanId } });
      if (!tickets) {
        throw new GraphQLError('No se encontraron tickets para el préstamo.');
      }
      return tickets;
    },
    getActiveTickets: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.COORDINATOR && authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('No autorizado para ver tickets activos.');
      }
      const tickets = await db.ticket.findMany({ where: { state: 'OPEN' } });
      if (!tickets) {
        throw new GraphQLError('No se encontraron tickets activos.');
      }
      return tickets;
    },
    getAssignedTicketsByUserId: async (parent, { userId }: { userId: string }, { db, authData }) => {
      if (authData.role !== Enum_RoleName.COORDINATOR && authData.role !== Enum_RoleName.ADMIN) {
        throw new GraphQLError('No autorizado para ver tickets asignados.');
      }
      const tickets = await db.ticket.findMany({ where: { technicianId: userId } });
      if (!tickets) {
        throw new GraphQLError('No se encontraron tickets asignados.');
      }
      return tickets;
    },
    getUserAssignedTickets: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.TECHNICAL) {
        throw new GraphQLError('Solo los técnicos tienen tickets asignados');
      }
      const user = db.user.findUnique({ where: { email: authData.email } });
      const tickets = await db.ticket.findMany({ where: {}});
      if (!tickets) {
        throw new GraphQLError('No se encontraron tickets asignados.');
      }
      return tickets
    },
    getUserAssignedActiveTickets: async (parent, args, { db, authData }) => {
      if (authData.role !== Enum_RoleName.TECHNICAL) {
        throw new GraphQLError('Solo los técnicos tienen tickets asignados');
      }
      const user = db.user.findUnique({ where: { email: authData.email } });
      const tickets = await db.ticket.findMany({ where: { state: 'OPEN' }});
      if (!tickets) {
        throw new GraphQLError('No se encontraron tickets activos asignados.');
      }
      return tickets
    }

  },

  Mutation: {
    createTicket: async (parent, { input }: { input: CreateTicketInput }, { db, authData }) => {
      const newTicket = await db.ticket.create({
        data: {
          subject: input.subject,
          description: input.description,
          loan: { connect: { id: input.loanId } },
          device: { connect: { id: input.deviceId } },
          state: 'OPEN',
          ...(input.technicianId && { technician: { connect: { id: input.technicianId } } }),
        },
      });
      return newTicket;
    },
    closeTicket: async (parent, { input }: { input: CloseTicketInput }, { db, authData }) => {
      if (authData.role !== 'ADMIN') {
        throw new GraphQLError('No autorizado para cerrar tickets.');
      }
      const ticket = await db.ticket.findUnique({ where: { id: input.ticketId } });
      if (!ticket) {
        throw new GraphQLError('Ticket no encontrado.');
      }
      const closedTicket = await db.ticket.update({
        where: { id: input.ticketId },
        data: {
          state: 'CLOSED',
        },
      });
      return closedTicket;
    },
  },
};

export { ticketResolvers };
