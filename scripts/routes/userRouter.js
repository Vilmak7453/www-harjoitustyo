"use strict";
var express = require('express');
var router = express.Router();

var auth = require('./auth');
var userController = require('../controllers/userController');

router.get('/', (req, res, next) => {

	res.redirect('/user/login');
});

router.get('/register', (req, res, next) => {

	res.render('register', {title: "Luo uusi käyttäjä"});
});

router.post('/register', userController.register);

router.get('/login', (req, res, next) => {

	res.render('login', {title: "Kirjaudu sisään"});
});

router.post('/login', userController.login);

router.get('/current', auth.required, userController.current);

router.get('/logout', (req, res, next) => {

	//session.authorization is used to keep track of which user is logged in
	req.session.authorization = null;
	res.redirect('/user/login');
});

module.exports = router;