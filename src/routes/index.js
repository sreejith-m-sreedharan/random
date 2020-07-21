
const random = require('./random');
const express = require('express');

module.exports = function(app){ 
 var router = express.Router();
  router.use('/random',random);
  return router;
}