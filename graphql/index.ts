import gql from 'graphql-tag';
import { userResolvers } from './queries/users/resolvers';
import { userTypes } from './queries/users/types';
import { sessionTypes } from './queries/session/types';
import { roleTypes } from './queries/role/types';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [defaultTypes, userTypes, sessionTypes, roleTypes];

const resolvers = [userResolvers];

export { types, resolvers };