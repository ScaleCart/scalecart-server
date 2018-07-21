import joinMonster from 'join-monster';

const isProd = process.env.NODE_ENV === 'production';
const ACCEPTED_LANGUAGES = JSON.parse(process.env.ACCEPTED_LANGUAGES);
const DEFAULT_LANGUAGE = process.env.DEFAULT_LANGUAGE;

const joinMonsterOptions = { minify: true, dialect: 'pg' };

function dbCall(sql, args, ctx) {
  const language = ctx.acceptsLanguages(ACCEPTED_LANGUAGES) || DEFAULT_LANGUAGE;
  if (!isProd && ctx && ctx.response) {
    ctx.set('X-SQL-Preview', ctx.response.get('X-SQL-Preview') + '%0A%0A' + sql.replace(/%/g, '%25').replace(/\n/g, '%0A'));
  }
  return ctx.db.knex.raw(sql, { ...args, language, defaultLanguage: DEFAULT_LANGUAGE });
}

export function runQuery(args, ctx, resolveInfo) {
  return joinMonster(resolveInfo, ctx, sql => dbCall(sql, args, ctx), joinMonsterOptions)
    .catch(error => {
      console.error(error);
      throw isProd ? "Query error" : error;
    });
}

export function getNode(id, type, ctx, resolveInfo) {
  return joinMonster.getNode(type, resolveInfo, ctx, id,
    sql => dbCall(sql, { id }, ctx),
    joinMonsterOptions);
}
