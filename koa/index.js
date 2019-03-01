const express = require('express');
const router = express.Router();

const ctrl = require('../controllers');

const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  req.flash('msglogin', 'Для доступа к админке нужно зайти под админским аккаунтом');
  res.redirect(301, '/login');
};

router.get('/', ctrl.home.get);
router.post('/', ctrl.home.post);
router.get('/admin', isAdmin, ctrl.admin.get);
router.post('/admin/skills', isAdmin, ctrl.admin.postSkills);
router.post('/admin/upload', isAdmin, ctrl.admin.postUpload);
router.get('/login', ctrl.login.get);
router.post('/login', ctrl.login.post);

module.exports = router;
