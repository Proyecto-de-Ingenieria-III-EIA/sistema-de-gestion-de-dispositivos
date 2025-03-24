import gql from 'graphql-tag';

const userTypes = gql`
  type User {
    id: ID
    name: String
    email: String
    emailVerified: DateTime
    image: String
    sessions: [Session]
    role: Role
  }

  type Query {
    getUsers: [User]
    getUserByEmail(email: String): User
  }

  type Mutation {
    updateUserRole(id: String, roleName: String): User
    updateUserRoleByEmail(email: String, roleName: String): User
  }
`;

export { userTypes };