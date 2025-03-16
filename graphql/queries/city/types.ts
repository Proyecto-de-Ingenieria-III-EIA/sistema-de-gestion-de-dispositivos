import gql from 'graphql-tag';

const cityTypes = gql`
  type City {
    id: ID!
    name: String!      
  }
`;

export { cityTypes };