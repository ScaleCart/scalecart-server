import * as Knex from 'knex';

export const knex = Knex(require('../../knexfile'));
export const raw = knex.raw.bind(knex);
export { default as Customer } from './customer';