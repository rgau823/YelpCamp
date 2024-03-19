const express = require('express');
const router = express.Router();
const catchAsync = require('../util/CatchAsync')
const passport = require('passport')
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

router.route('/register')
.get(users.renderNewForm)
.post(catchAsync(users.registerUser))

router.route('/login')
  .get(users.renderLogin)
  .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'} ), users.login)

router.get('/logout', users.logout)

module.exports = router;