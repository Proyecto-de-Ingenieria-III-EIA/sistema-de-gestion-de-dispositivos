import gql from 'graphql-tag';
import { userResolvers } from './queries/users/resolvers';
import { userTypes } from './queries/users/types';
import { sessionTypes } from './queries/session/types';
import { roleTypes } from './queries/role/types';
import { loanTypes } from './queries/loan/types';
import { loanResolvers } from './queries/loan/resolvers';
import { deviceTypes } from './queries/device/types';
import { cityTypes } from './queries/city/types';
import { deviceResolvers } from './queries/device/resolvers';
import { peripheralTypes } from './queries/peripheral/types';
import { peripheralResolvers } from './queries/peripheral/resolvers';
import { ticketResolvers } from './queries/ticket/resolvers';
import { ticketTypes } from './queries/ticket/types';
import { cityResolvers } from './queries/city/resolvers';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [defaultTypes, userTypes, sessionTypes, roleTypes, cityTypes, deviceTypes, loanTypes, peripheralTypes, ticketTypes, cityTypes];
const resolvers = [userResolvers, loanResolvers, deviceResolvers, peripheralResolvers, ticketResolvers, cityResolvers];

export { types, resolvers };