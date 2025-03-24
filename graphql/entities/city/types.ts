import gql from 'graphql-tag';

const cityTypes = gql`
  type City {
    id: ID!
    name: String!
  }

  input CreateCityInput {
    name: String!
  }

  extend type Query {
    getCities: [City!]!
    getCityById(id: ID!): City!
    getCityByName(name: String!): City!
  }

  extend type Mutation {
    createCity(input: CreateCityInput!): City!
  }
`;

export { cityTypes };