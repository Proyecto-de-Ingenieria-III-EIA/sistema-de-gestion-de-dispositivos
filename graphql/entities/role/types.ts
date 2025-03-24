import gql from 'graphql-tag';

const roleTypes = gql`
  enum Enum_RoleName {
    ADMIN
    USER
  }

  type Role {
    id: ID
    name: Enum_RoleName
    users: [User]
    createdAt: DateTime
    updatedAt: DateTime
  }
`;

export { roleTypes };