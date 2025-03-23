import gql from 'graphql-tag';

const deviceTypes = gql`
  type Device {
    id: String!
    loans: [Loan!]!
    tickets: [Ticket!]!
    serialNumber: String!
    brand: String!
    model: String!
    components: [Component!]!
    extraInfo: String
    price: Decimal!
    category: Enum_Category!
    removed: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateDeviceInput {
    serialNumber: String!
    brand: String!
    model: String!
    componentID: [String!]!
    extraInfo: String
    price: Decimal!
    category: Enum_Category!
  }
`;

export { deviceTypes };