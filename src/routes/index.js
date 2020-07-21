
const random = require('./random');
const express = require('express');

module.exports = function(app){ 
  const router = express.Router();
  router.use('/random',random(app, router));
  return router;
}