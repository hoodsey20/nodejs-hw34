const express = require('express');
const router = express.Router();

const ctrl = require('../controllers');

router.get('/', ctrl.home.get);
router.post('/', ctrl.home.post);
router.get('/admin', ctrl.admin.get);
router.post('/admin/skills', ctrl.admin.postSkills);
router.get('/login', ctrl.login.get);
router.post('/login', ctrl.login.post);

module.exports = router;
