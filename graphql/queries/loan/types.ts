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

  input CreateLoanInput {
    deviceIds: [String!]!
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
  }
`;

export { loanTypes };