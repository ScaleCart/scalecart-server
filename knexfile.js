require('dotenv').config();
const _ = require('lodash');
const PgResult = require('pg/lib/result');

const camelCaseKeys = obj => _.mapKeys(obj, (v, k) => _.camelCase(k));

module.exports = {
  client: 'postgresql',
  connection: {
    host : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  },
  wrapIdentifier: (value, origImpl, queryContext) => {
    console.log('wrap');
    debugger;
    return value === '*' ? origImpl(value) : origImpl(_.snakeCase(value));
  },
  postProcessResponse: (result, queryContext) => {
    if (result instanceof PgResult) {
      return result;
    } else if (Array.isArray(result)) {
      return result.map(v => camelCaseKeys(v));
    } else if (result instanceof Object) {
      return camelCaseKeys(result);
    } else {
      return result;
    }
  }
};
