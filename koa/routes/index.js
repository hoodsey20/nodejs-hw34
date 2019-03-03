const Router = require('koa-router');
const router = new Router();
const ctrl = require('../controllers');
const koaBody = require('koa-body');

const isAdmin = (ctx, next) => {
  if (ctx.session.isAdmin) {
    return next();
  }
  ctx.flash.set('Для доступа к админке нужно зайти под админским аккаунтом');
  ctx.status = 301;
  ctx.redirect('/login');
};

router.get('/', ctrl.home.get);
router.post('/', koaBody(), ctrl.home.post);

router.get('/login', ctrl.login.get);
router.post('/login', koaBody(), ctrl.login.post);

router.get('/admin', isAdmin, ctrl.admin.get);
router.post('/admin/skills', isAdmin, koaBody(), ctrl.admin.postSkills);
router.post(
  '/admin/upload',
  isAdmin,
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/upload',
    },
  }),
  ctrl.admin.postUpload
);

module.exports = router;
