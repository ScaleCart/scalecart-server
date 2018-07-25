import {
  globalIdResolver,
  connectionFromArray,
} from 'graphql-relay-tools';
import { runQuery } from '../utils';

const resolvers = {
  Query: {
    products(parent, args, ctx, resolveInfo) {
      return runQuery(args, ctx, resolveInfo);
    },
  },
  Product: {
    id: globalIdResolver()
  },
}

export default resolvers;