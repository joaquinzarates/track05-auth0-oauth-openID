<a id="readme-top"></a>
 
<div align="center">
  <h3 align="center">OAuth 2.0 + OpenID Connect con Auth0</h3>
  <p align="center">
    Proyecto para validar los conocimientos obtenidos en el Track: Seguridad Web & API, para ello se realizará el desarrollo de una aplicación que implementa autenticación delegada con Auth0 mediante OAuth 2.0 y OpenID Connect
  </p>
</div>

---
 
## Tabla de contenidos
 
<details>
  <summary>Ver contenidos</summary>
  <ol>
    <li><a href="#sobre-el-proyecto">Sobre el proyecto</a></li>
    <li><a href="#tecnologías">Tecnologías</a></li>
    <li><a href="#requisitos-previos">Requisitos previos</a></li>
    <li><a href="#instalación">Instalación</a></li>
    <li><a href="#configuración-de-auth0">Configuración de Auth0</a></li>
    <li><a href="#variables-de-entorno">Variables de entorno</a></li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#validación-del-access-token">Validación del Access Token</a></li>
    <li><a href="#contacto">Contacto</a></li>
  </ol>
</details>

---
 
## Sobre el proyecto
 
Aplicación Node.js + Express que implementa el flujo **Authorization Code con PKCE** (OAuth 2.0) y la capa de identidad **OpenID Connect** usando Auth0 como proveedor de identidad, con una API protegida mediante Access Token y scopes.
 
**Características:**
- Flujo Authorization Code + PKCE con `express-openid-connect`
- Sesión de usuario con claims del ID Token (OIDC)
- API protegida con Access Token validado via JWKS
- Verificación de `iss`, `aud`, `exp` y firma RS256
- Autorización por scopes (`read:reports`)
- Respuestas HTTP correctas: 200, 401, 403
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Tecnologías
 
- Node.js 18+
- Express
- express-openid-connect
- express-oauth2-jwt-bearer
- EJS
- dotenv
- Auth0
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Requisitos previos
 
- Node.js 18 o superior
- Cuenta gratuita en [Auth0](https://auth0.com)
```sh
node --version
```
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Instalación
 
1. Clona el repositorio
```sh
git clone https://github.com/joaquinzarates/OAuth-2.0---OpenID-Connect---Auth0.git
```
 
2. Entra a la carpeta
```sh
cd OAuth-2.0---OpenID-Connect---Auth0
```
 
3. Instala las dependencias
```sh
npm install
```
 
4. Copia el archivo de variables de entorno
```sh
cp .env.example .env
```
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Configuración de Auth0
 
1. Crea una aplicación en [manage.auth0.com](https://manage.auth0.com) → **Applications → Create Application → Regular Web Application**
2. En **Settings** copia: `Domain`, `Client ID` y `Client Secret`
3. En **Application URIs** agrega:
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
4. Crea una API en **Applications → APIs → Create API**
   - Identifier: `https://api.oauth-t05`
   - Agrega el permiso `read:reports` en la pestaña **Permissions**
5. En **App Access** de la API, activa `read:reports` para tu aplicación en **User-delegated Access** y **Client Access**
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Variables de entorno
 
Edita el archivo `.env` con los valores de Auth0:
 
```
AUTH0_DOMAIN=tu-dominio.us.auth0.com
AUTH0_CLIENT_ID=tu-client-id
AUTH0_CLIENT_SECRET=tu-client-secret
AUTH0_AUDIENCE=https://api.oauth-t05
SESSION_SECRET=genera-con-node-crypto
APP_BASE_URL=http://localhost:3000
PORT=3000
```
 
Genera el `SESSION_SECRET` con:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---
 
## Uso
 
```sh
node src/server.js
```
 
Abre el navegador en `http://localhost:3000`
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

--- 
## Endpoints
 
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Página de inicio | No |
| GET | `/login` | Inicia flujo PKCE | No |
| GET | `/callback` | Intercambia código por tokens | No |
| GET | `/profile` | Claims del ID Token | Sesión |
| GET | `/logout` | Cierra sesión | No |
| GET | `/api/public` | Endpoint público | No |
| GET | `/api/private` | Requiere Access Token | 401 sin token |
| GET | `/api/scoped` | Requiere scope `read:reports` | 403 sin scope |
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---


## Validación del Access Token
 
La API valida cada token automáticamente con `express-oauth2-jwt-bearer`:
 
| Claim | Verificación |
|-------|-------------|
| Firma | RS256 via JWKS de Auth0 |
| `iss` | `https://dev-0nzwsv4p2dr260zc.us.auth0.com/` |
| `aud` | `https://api.oauth-t05` |
| `exp` | Token no expirado |
 
El parámetro `state` es generado y verificado automáticamente por `express-openid-connect` para mitigar ataques CSRF en el flujo de autorización.
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---

## Contacto
 
Joaquin Zárate  - joaquin.zarate@ids.com.mx
 
Project Link: [https://github.com/joaquinzarates/OAuth-2.0---OpenID-Connect---Auth0](https://github.com/joaquinzarates/OAuth-2.0---OpenID-Connect---Auth0)
 
<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p