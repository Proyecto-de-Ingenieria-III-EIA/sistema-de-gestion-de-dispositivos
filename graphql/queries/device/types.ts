import gql from 'graphql-tag';

const deviceTypes = gql`
  # Enum para definir las categorías permitidas
  enum Enum_Category {
    LAPTOP
    PC
    MOBILE
    TABLET
  }

  # Definición del tipo Device, con todos los campos relevantes
  type Device {
    id: ID!
    serialNumber: String!
    brand: String!
    model: String!
    extraInfo: String
    price: Float!
    category: Enum_Category!
    createdAt: String!
    updatedAt: String!
  }

  # Input para la creación de un Device
  input CreateDeviceInput {
    serialNumber: String!
    brand: String!
    model: String!
    extraInfo: String
    price: Float!
    category: Enum_Category!
  }

  # Input para actualizar un Device
  input UpdateDeviceInput {
    deviceId: ID!
    serialNumber: String
    brand: String
    model: String
    extraInfo: String
    price: Float
    category: Enum_Category
  }

  # Respuesta al eliminar un Device
  type DeleteResponse {
    message: String!
  }

  # Definición de las operaciones Query
  type Query {
    getDevices: [Device!]!
    getDeviceById(id: ID!): Device
  }

  # Definición de las operaciones Mutation
  type Mutation {
    createDevice(input: CreateDeviceInput!): Device!
    updateDevice(input: UpdateDeviceInput!): Device!
    deleteDevice(id: ID!): DeleteResponse!
  }
`;

export { deviceTypes };