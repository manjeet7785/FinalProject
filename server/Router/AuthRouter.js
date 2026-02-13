const mongoose = require('mongoose');
const router = require('express').Router();
const { SignUp, SignIn, SignOut, RefreshAccessToken } = require('../controller/AuthController');

router.post('/signup', SignUp);
router.post('/signin', SignIn);
router.get('/refresh-token', RefreshAccessToken);
router.post('/signout', SignOut);

module.exports = router;