import gql from 'graphql-tag';

const loanTypes = gql`
  enum LoanStatus {
    PENDING
    APPROVED
    REJECTED
    EXTENDED
    FINISHED
  }

  type Loan {
    id: ID!
    user: User!
    devices: [Device!]!
    startDate: DateTime!
    endDate: DateTime!
    status: LoanStatus!
    rejectionReason: String
    createdAt: DateTime!
    updatedAt: DateTime!
    originCity: City! 
    arrivalCity: City!       
    peripherals: [Peripheral!]!
  }
  
  input getLoansByUserEmailInput {
    userEmail: String!
  }

  input CreateLoanInput {
    userEmail: String!
    deviceIds: [String!]!
    peripheralsIds: [String!]!
    startDate: DateTime!
    endDate: DateTime!
    originCityId: String!   
    arrivalCityId: String! 
  }

  input UpdateLoanStatusInput {
    loanId: String!
    status: LoanStatus!
    rejectionReason: String
  }

  input ExtendLoanInput {
    loanId: String!
    newEndDate: DateTime!
  }

  type Mutation {
    createLoan(input: CreateLoanInput!): Loan!
    updateLoanStatus(input: UpdateLoanStatusInput!): Loan!
    extendLoan(input: ExtendLoanInput!): Loan!
  }

  type Query {
    getLoans: [Loan!]!
    getLoanReminders: [Loan!]!
    getLoansByUserEmail(input: getLoansByUserEmailInput!): [Loan!]!
  }
`;

export { loanTypes };