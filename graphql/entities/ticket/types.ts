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

  input getUserAssignedTicketsInput {
    state: Enum_TicketState
  }

  input CloseTicketInput {
    ticketId: ID!
  }

  type Query {
    getTickets: [Ticket!]!
    getTicketById(id: ID!): Ticket
    getTicketsByLoanId(loanId: ID!): [Ticket!]!
    getActiveTickets: [Ticket!]!
    getAssignedTicketsByUserId(userId: ID!): [Ticket!]!
    getUserAssignedTickets(input: getUserAssignedTicketsInput): [Ticket!]!
  }

  type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    closeTicket(input: CloseTicketInput!): Ticket!
    assignTicketToTechnician(ticketId: ID!, technicianId: ID!): Ticket!
  }
`;

export { ticketTypes };
