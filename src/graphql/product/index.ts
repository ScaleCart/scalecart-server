import * as joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
import typeDefs from './typeDefs';
import resolvers from './resolvers';

export default {
  typeDefs,
  resolvers,
  decorator(schema) {
    joinMonsterAdapt(schema, {
      Query: {
        products: {
          sqlPaginate: true,
          orderBy: 'id',
        }
      },
      Product: {
        sqlTable: 'product',
        uniqueKey: 'id',
        fields: {
          name: {
            sqlExpr: (table) => {
              return `COALESCE(${table}.name->:language, ${table}.name->:defaultLanguage)`;
            }
          },
          description: {
            sqlExpr: (table) => {
              return `COALESCE(${table}.description->:language, ${table}.description->:defaultLanguage)`;
            }
          },
          discountPrice: {
            sqlColumn: 'discount_price',
          },
        },
      },
    });
    return schema;
  },
};
