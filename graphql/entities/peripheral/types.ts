import gql from 'graphql-tag';

const peripheralTypes = gql`
  enum Enum_PeripheralType {
    MOUSE
    KEYBOARD
    MONITOR
    HEADSET
    WEBCAM
    OTHER
  }

  type Peripheral {
    id: ID!
    serialNumber: String!
    model: String!
    type: Enum_PeripheralType!
    brand: String!
    price: Float!
    extraInfo: String!
    removed: Boolean!         
    createdAt: String!
    updatedAt: String!
  }

  input CreatePeripheralInput {
    serialNumber: String!
    model: String!
    type: Enum_PeripheralType!
    brand: String!
    price: Float!
    extraInfo: String
  }

  input UpdatePeripheralInput {
    peripheralId: ID!
    serialNumber: String
    model: String
    type: Enum_PeripheralType
    brand: String
    price: Float
    extraInfo: String
  }

  type DeleteResponse {
    message: String!
  }

  type Query {
    getPeripherals: [Peripheral!]!
    getPeripheralById(id: ID!): Peripheral
  }

  type Mutation {
    createPeripheral(input: CreatePeripheralInput!): Peripheral!
    updatePeripheral(input: UpdatePeripheralInput!): Peripheral!
    deletePeripheral(id: ID!): DeleteResponse!
  }
`;

export { peripheralTypes };
