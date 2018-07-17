import * as koa from 'koa';
import * as koaRouter from 'koa-router';
import * as koaBody from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import schema from './graphql';

require('dotenv').config();

let koaCustomGraphiql, koaStatic, path;
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  koaCustomGraphiql = require('koa-custom-graphiql').default;
  koaStatic = require('koa-static');
  path = require('path');
}

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

app.use(koaBody());

router.post('/graphql', graphqlKoa(context => ({
  schema,
  context,
  formatError: (error) => {
    console.error(error);
    return error;
  }
})));
router.get('/graphql', graphqlKoa({ schema }));
if (!isProd) {
  router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql',  }));
  router.get('/graphsiql', koaCustomGraphiql({
    css: '/graphiql.css',
    js: '/graphiql.js'
  }));
  app.use(koaStatic(path.resolve(require.resolve('graphsiql'), '..', '..')))
}

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));