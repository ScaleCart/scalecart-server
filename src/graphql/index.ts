import { makeExecutableSchema } from 'graphql-tools';
import { mergeTypes } from 'merge-graphql-schemas';
import Product from './product';
import NodeModule from './node';
import * as _ from 'lodash';

const modules = [
  NodeModule,
  Product,
];

const typeDefs = modules.reduce((acc, mod) => [...acc, ...mod.typeDefs], []);
const resolvers = _.merge({}, ...modules.map(mod => mod.resolvers));

const schema = modules.reduce((acc, mod) => mod.decorator ? mod.decorator(acc) : acc,
  makeExecutableSchema({
    typeDefs: mergeTypes(typeDefs),
    resolvers,
  })
);

export default schema;
