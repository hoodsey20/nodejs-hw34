const Koa = require('koa');
const app = new Koa();
const koaStatic = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const fs = require('fs');
const flash = require('koa-flash-simple');

const pug = new Pug({
  viewPath: './source/template',
  pretty: false,
  basedir: './source/template',
  noCache: true,
  app: app,
});
const config = require('./config');


const router = require('./koa/routes');

app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(koaStatic('./public'));

const port = process.env.PORT || 3000;

const errorHandler = require('./koa/libs/error');

app.use(errorHandler);

app.on('error', (err, ctx) => {
  ctx.render('pages/error', {
    status: ctx.response.status,
    error: ctx.response.message,
  });
});

app.listen(port, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Server start on port: ', port);
});
