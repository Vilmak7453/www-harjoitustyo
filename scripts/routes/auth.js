"use strict";
const jwt = require('express-jwt');

//Receive jsonwebtoken from session and use it for authentication
const getTokenFromHeaders = (req) => {
  const authorization = req.session.authorization;

  //Must be in form "Token jakhödöiksaöjfalsjlf3298"
  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

//There are two options: token must be right or not. In other words, some paths can only be accessed if user is logged and other can be accessed either logged or not.
//Save user id to req.payload
const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;