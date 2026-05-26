'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env'), debug: true });
const express = require('express');
const path    = require('path');
const { auth } = require('express-openid-connect');
const { oidcConfig } = require('./config/auth0');

const authRoutes = require('./routes/authRoutes');
const apiRoutes  = require('./routes/apiRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth(oidcConfig));

app.use('/',    authRoutes);
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message || err);
  const status = err.status || 500;

  if (req.path.startsWith('/api')) {
    return res.status(status).json({
      error:   'internal_error',
      message: err.message || 'Error interno del servidor.',
    });
  }

  res.status(status).render('home', {
    isAuthenticated: req.oidc?.isAuthenticated() ?? false,
    user: req.oidc?.user ?? null,
  });
});

module.exports = app;