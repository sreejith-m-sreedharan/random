const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../routes');

module.exports =  async (app) => {

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(routes(app));

  return app;
}