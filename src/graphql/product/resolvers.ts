import {
  globalIdResolver,
  connectionFromArray,
} from 'graphql-relay-tools';
import { runQuery } from '../utils';

const resolvers = {
  Query: {
    products(parent, args, ctx, resolveInfo) {
      return runQuery(args, ctx, resolveInfo)
        .then(data => connectionFromArray(data, args));
    },
  },
  Product: {
    id: globalIdResolver()
  },
}

export default resolvers;