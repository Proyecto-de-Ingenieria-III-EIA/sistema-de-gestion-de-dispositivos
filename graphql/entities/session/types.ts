import gql from 'graphql-tag';

const sessionTypes = gql`
  type Session {
    sessionToken: String
    expires: DateTime
    createdAt: DateTime
    updatedAt: DateTime
    user: User
  }
`;

export { sessionTypes };