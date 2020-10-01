const express = require('express');
const router = express.Router();

const userCtrl = require('..controller/controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/account', userCtrl.getUser);

module.exports = router;