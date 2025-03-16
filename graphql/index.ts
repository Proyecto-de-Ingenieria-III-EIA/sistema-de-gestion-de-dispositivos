import gql from 'graphql-tag';
import { userResolvers } from './queries/users/resolvers';
import { userTypes } from './queries/users/types';
import { sessionTypes } from './queries/session/types';
import { roleTypes } from './queries/role/types';
import { loanTypes } from './queries/loan/types';
import { loanResolvers } from './queries/loan/resolvers';
import { deviceTypes } from './queries/device/types';
import { cityTypes } from './queries/city/types';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [defaultTypes, userTypes, sessionTypes, roleTypes, cityTypes, deviceTypes, loanTypes];
const resolvers = [userResolvers, loanResolvers];

export { types, resolvers };