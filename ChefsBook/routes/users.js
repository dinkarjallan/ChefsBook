const express = require('express');
const router = express.Router({ mergeParams: true });

// router dependencies
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/login' }), users.login); // passport middleware in action

router.get('/logout', users.logout);

module.exports = router;