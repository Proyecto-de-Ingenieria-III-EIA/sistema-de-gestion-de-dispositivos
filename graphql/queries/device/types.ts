import gql from 'graphql-tag';

const deviceTypes = gql`
  type Device {
    id: ID!
    name: String!     
  }
`;

export { deviceTypes };