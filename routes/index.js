const express = require('express');
const router = express.Router();

const ctrl = require('../controllers');

router.get('/', ctrl.home.get);
router.post('/', ctrl.home.post);

module.exports = router;
