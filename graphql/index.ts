import gql from 'graphql-tag';
import { userResolvers } from './entities/users/resolvers';
import { userTypes } from './entities/users/types';
import { sessionTypes } from './entities/session/types';
import { roleTypes } from './entities/role/types';
import { loanTypes } from './entities/loan/types';
import { loanResolvers } from './entities/loan/resolvers';
import { deviceTypes } from './entities/device/types';
import { cityTypes } from './entities/city/types';
import { deviceResolvers } from './entities/device/resolvers';
import { peripheralTypes } from './entities/peripheral/types';
import { peripheralResolvers } from './entities/peripheral/resolvers';
import { ticketResolvers } from './entities/ticket/resolvers';
import { ticketTypes } from './entities/ticket/types';
import { cityResolvers } from './entities/city/resolvers';

const defaultTypes = gql`
  scalar DateTime
`;

const types = [defaultTypes, userTypes, sessionTypes, roleTypes, cityTypes, deviceTypes, loanTypes, peripheralTypes, ticketTypes, cityTypes];
const resolvers = [userResolvers, loanResolvers, deviceResolvers, peripheralResolvers, ticketResolvers, cityResolvers];

export { types, resolvers };