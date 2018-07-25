require('dotenv').config();
import * as koa from 'koa';
import * as koaRouter from 'koa-router';
import * as koaBody from 'koa-bodyparser';
import * as koaSession from 'koa-session';
import * as redisStore from 'koa-redis';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import schema from './graphql';
import * as db from './db';

const isDev = process.env.NODE_ENV === 'development';

const app = new koa();
const router = new koaRouter();
const PORT = 4000;

app.keys = [process.env.SESSION_SECRET];

declare module 'koa' {
  interface BaseContext {
    db: typeof db;
  }
}
app.context.db = db;

// Development utils
if (isDev) {
  const koaCustomGraphiql = require('koa-custom-graphiql').default;
  const koaStatic = require('koa-static');
  const path = require('path');
  const cors = require('@koa/cors');

  app.use(cors({ credentials: true }));
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql', }));
  router.get('/graphsiql', koaCustomGraphiql({
    css: '/graphiql.css',
    js: '/graphiql.js'
  }));
  app.use(koaStatic(path.resolve(require.resolve('graphsiql'), '..', '..')))
}

app.use(koaBody());

app.use(koaSession({
  key: 'session',
  maxAge: 86400000 * 365,
  renew: true,
  store: redisStore(<any>{
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: 0,
  })
}, app));

router.post('/graphql', graphqlKoa(context => ({
  schema,
  context,
  formatError: (error) => {
    console.error(error);
    return error;
  }
})));
router.get('/graphql', graphqlKoa({ schema }));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));