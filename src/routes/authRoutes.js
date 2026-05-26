'use strict';

const express     = require('express');
const requireAuth = require('../middlewares/requireAuth');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user || null,
  });
});

router.get('/profile', requireAuth, (req, res) => {
  const user = req.oidc.user;

  const claims = {
    sub:            user.sub,
    name:           user.name,
    email:          user.email,
    email_verified: user.email_verified,
    picture:        user.picture,
    updated_at:     user.updated_at,
  };

  res.render('profile', {
    user,
    claims,
    rawIdToken: req.oidc.idToken,
  });
});

router.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: process.env.APP_BASE_URL });
});

module.exports = router;