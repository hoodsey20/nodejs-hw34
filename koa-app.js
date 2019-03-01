const Koa = require('koa');
const app = new Koa();
const koaStatic = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const fs = require('fs');
const pug = new Pug({
  viewPath: './source/template',
  pretty: false,
  basedir: './source/template',
  noCache: true,
  app: app,
});
const config = require('./config');

app.use(koaStatic('./public'));

const errorHandler = require('./koa/libs/error');

app.use(errorHandler);

app.on('error', (err, ctx) => {
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

const router = require('./koa/routes');

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Server start on port: ', port);
});
