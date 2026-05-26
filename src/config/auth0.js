'use strict';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('DOTENV PATH:', path.resolve(__dirname, '../../.env'));
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN);
const REQUIRED = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_AUDIENCE',
  'SESSION_SECRET',
  'APP_BASE_URL',
];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `[config/auth0] Faltan variables de entorno: ${missing.join(', ')}`
  );
}

const domain       = process.env.AUTH0_DOMAIN.replace(/\/$/, '');
const clientId     = process.env.AUTH0_CLIENT_ID;
const clientSecret = process.env.AUTH0_CLIENT_SECRET;
const audience     = process.env.AUTH0_AUDIENCE;
const baseURL      = process.env.APP_BASE_URL.replace(/\/$/, '');
const secret       = process.env.SESSION_SECRET;

const oidcConfig = {
  authRequired: false,
  auth0Logout: true,
  secret,
  baseURL,
  clientID: clientId,
  issuerBaseURL: `https://${domain}`,
  clientSecret,
  authorizationParams: {
    response_type: 'code',
    audience,
    scope: 'openid profile email read:reports',
  },
};

const jwtConfig = {
  audience,
  issuerBaseURL: `https://${domain}`,
  tokenSigningAlg: 'RS256',
};

module.exports = { oidcConfig, jwtConfig, domain, clientId, audience, baseURL };