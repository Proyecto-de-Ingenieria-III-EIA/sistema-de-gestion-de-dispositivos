import { Resolver } from '@/types';
import { GraphQLError } from 'graphql';

interface CreateTicketInput {
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
