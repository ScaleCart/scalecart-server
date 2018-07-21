import * as joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
import * as _ from 'lodash';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default {
  typeDefs,
  resolvers,
  decorator(schema) {
    joinMonsterAdapt(schema, {
      Customer: {
        sqlTable: 'customer',
        uniqueKey: 'id',
      },
      Query: {
        fields: {
          viewer: {
            where: (table) => `${table}.id = :id`,
          },
        }
      },
    });
    return schema;
  },
};
