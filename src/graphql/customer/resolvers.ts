import {
  toGlobalId,
  connectionFromArray,
  globalIdResolver,
} from 'graphql-relay-tools';
import * as argon2 from 'argon2';
import { runQuery } from '../utils';

const resolvers = {
  Query: {
    viewer(parent, args, ctx, resolveInfo) {
      const id = ctx.session.customer && ctx.session.customer.id;
      if (!id) {
        return null;
      }
      return runQuery({ id }, ctx, resolveInfo);
    }
  },
  Mutation: {
    async register(parent, args, ctx, resolveInfo) {
      const { input } = args;
      const email = input.email.toLowerCase().trim();
      const password = await argon2.hash(input.password);
      try {
        const customer = await ctx.db.Customer.create({
          ...input,
          email,
          password,
        });
        ctx.session.customer = customer;
        return {
          success: true,
        }
      }
      catch (error) {
        console.error(error);
        throw new Error(error.constraint || 'unknown_error');
      }
    },
    async login(parent, args, ctx, resolveInfo) {
      const { input } = args;
      const email = input.email.toLowerCase().trim();
      const customer = await ctx.db.Customer
        .query()
        .first('*')
        .where({ email });
      if (!customer) {
        throw new Error('invalid_credentials');
      }

      const valid = await argon2.verify(customer.password, input.password);
      if (!valid) {
        throw new Error('invalid_credentials');
      }

      ctx.session.customer_id = customer.id;
      ctx.session.customer = {
        id: customer.id,
      };

      return {
        ...customer,
        // id: toGlobalId('Customer', customer.id),
      };
    },
    async logout(parent, args, ctx, resolveInfo) {
      ctx.session = null;
      ctx.cookies.set('session');
      ctx.cookies.set('session.sig');
      return true;
    },
  },
  Customer: {
    id: globalIdResolver()
  },
}

export default resolvers;