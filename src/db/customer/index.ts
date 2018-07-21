import { knex } from '../';

export default {
  query() {
    return knex('customer');
  },
  create(data) {
    return knex('customer')
      .insert(data)
      .returning(['id'])
      .get(0);
  }
}