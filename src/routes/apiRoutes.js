'use strict';

const express      = require('express');
const { auth: checkJwt } = require('express-oauth2-jwt-bearer');
const requireScope = require('../middlewares/requireScope');
const { jwtConfig } = require('../config/auth0');

const router = express.Router();

const validateJwt = checkJwt(jwtConfig);

router.get('/public', (req, res) => {
  res.status(200).json({
    endpoint:  'GET /api/public',
    access:    'sin restricciones',
    message:   'Este endpoint es público y no requiere autenticación.',
    timestamp: new Date().toISOString(),
  });
});

router.get('/private', validateJwt, (req, res) => {
  res.status(200).json({
    endpoint:  'GET /api/private',
    access:    'Access Token válido requerido',
    message:   'Token verificado correctamente.',
    sub:       req.auth.payload.sub,
    scope:     req.auth.payload.scope,
    iss:       req.auth.payload.iss,
    aud:       req.auth.payload.aud,
    exp:       new Date(req.auth.payload.exp * 1000).toISOString(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/scoped', validateJwt, requireScope('read:reports'), (req, res) => {
  res.status(200).json({
    endpoint:  'GET /api/scoped',
    access:    'Access Token + scope read:reports requeridos',
    message:   'Token verificado y scope read:reports confirmado.',
    sub:       req.auth.payload.sub,
    scope:     req.auth.payload.scope,
    timestamp: new Date().toISOString(),
  });
});

router.use((err, req, res, next) => {
  if (err.status === 401) {
    return res.status(401).json({
      error:   'Sin autorización',
      message: 'Se requiere Token de acceso o su Token es inválido.',
    });
  }
  if (err.status === 403) {
    return res.status(403).json({
      error:   'forbidden',
      message: 'Permisos insuficientes.',
    });
  }
  next(err);
});

module.exports = router;