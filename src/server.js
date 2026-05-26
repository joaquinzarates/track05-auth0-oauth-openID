'use strict';

require('dotenv').config();

const app  = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('');
  console.log('Rutas disponibles:');
  console.log(`  GET  /           → Página de inicio`);
  console.log(`  GET  /login      → Inicia flujo PKCE → Auth0`);
  console.log(`  GET  /callback   → Intercambia código por tokens`);
  console.log(`  GET  /profile    → Claims del ID Token`);
  console.log(`  GET  /logout     → Cierra sesión`);
  console.log('');
  console.log('API:');
  console.log(`  GET  /api/public  → Sin token`);
  console.log(`  GET  /api/private → Access Token válido`);
  console.log(`  GET  /api/scoped  → Token + scope read:reports`);
});