import gql from 'graphql-tag';

const ticketTypes = gql`
  enum Enum_TicketState {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  type Ticket {
    id: ID!
    state: Enum_TicketState!
    subject: String!
    description: String!  # Mapea al campo "desription" del modelo Prisma
    loanId: ID!
    deviceId: ID!
    technicianId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input CreateTicketInput {
    subject: String!
    description: String!  # Nota: aunque en Prisma se llame "desription", aquí usamos "description" para claridad
    loanId: ID!
    deviceId: ID!
    technicianId: ID!
  }

  input CloseTicketInput {
    ticketId: ID!
  }

  type Query {
    getTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket
    getActiveTickets: [Ticket!]!
  }

  type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    closeTicket(input: CloseTicketInput!): Ticket!
  }
`;

export { ticketTypes };
