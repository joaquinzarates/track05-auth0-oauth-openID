<a id="readme-top"></a>

[![Node.js][nodejs-shield]][nodejs-url]
[![Express][express-shield]][express-url]
[![Auth0][auth0-shield]][auth0-url]
[![JWT][jwt-shield]][jwt-url]
[![OAuth2][oauth2-shield]][oauth2-url]
[![OpenID][openid-shield]][openid-url]
[![EJS][ejs-shield]][ejs-url]
[![dotenv][dotenv-shield]][dotenv-url]

<div align="center">
  <h3 align="center">OAuth 2.0 - OpenID Connect con Auth0</h3>
  <p align="center">
    Proyecto para validar los conocimientos obtenidos en el Track: Seguridad Web & API, para ello se realizará el desarrollo de una aplicación que implementa autenticación delegada con Auth0 mediante OAuth 2.0 y OpenID Connect
    <br />

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
- Sesión de usuario con claims del ID Token (Open ID Connect)
- API protegida con Access Token validado via JWKS
- Verificación de `iss`, `aud`, `exp` y firma RS256
- Autorización por scopes (`read:reports`)
- Respuestas HTTP correctas: 200, 401, 403

<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---

## Tecnologías

- Node.js 18+
- Express 5.2.1
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

se comprueba la versión actual de node mediante el siguiente comando:

```sh
node --version
```

<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---

## Configuración de Auth0

1. Crea una aplicación en [manage.auth0.com](https://manage.auth0.com) → **Applications → Create Application → Regular Web Application**
2. En **Settings** copia: `Domain`, `Client ID` y `Client Secret`
3. En **Application URIs** agrega:
   - Allowed Callback URLs: `http://localhost:3000/callback, https://oauth.pstmn.io/v1/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
4. En **Advanced Settings → Grant Types** verifica que **Authorization Code** esté activado
5. Crea una API en **Applications → APIs → Create API**
   - Name: el nombre que prefieras
   - Identifier: cualquier URL, por ejemplo `https://api.tu-proyecto.com`
   - Signing Algorithm: `RS256`
6. En la pestaña **Permissions** de la API agrega:
   - Permission: `read:reports`
7. En **App Access** de la API activa `read:reports` para tu aplicación en **User-delegated Access** y **Client Access**

---

## Instalación

1. Clonar el repositorio

```sh
git clone https://github.com/joaquinzarates/track05-auth0-oauth-openID.git
```

2. Entrar a la carpeta

```sh
cd track05-auth0-oauth-openID
```

3. Instalar las dependencias

```sh
npm install
```

4. Copiar el archivo de variables de entorno

```sh
cp .env.example .env
```

<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---

## Variables de entorno

Es necesario editar el archivo `.env` con los valores de Auth0:

```
AUTH0_DOMAIN=tu-dominio.us.auth0.com
AUTH0_CLIENT_ID=el-client-id
AUTH0_CLIENT_SECRET=el-client-secret
AUTH0_AUDIENCE=https://api.del-proyecto.com
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

ejecuta el siguiente comando en la terminal

```sh
node src/server.js
```
Abre el navegador en `http://localhost:3000`

### Flujo web
 
1. Haz clic en **Iniciar sesión con Auth0**
2. Ingresa tus credenciales en la pantalla de Auth0
3. Serás redirigido a la página de inicio con tu sesión activa
4. Ve a `/profile` para ver los claims del ID Token
5. Haz clic en **Cerrar sesión** para finalizar la sesión
---
 
### Pruebas de la API
 
#### Endpoint público
 
Abre directamente en el navegador:
 
```
http://localhost:3000/api/public
```
 
Respuesta esperada: **200 OK**
 
---
 
#### Endpoints protegidos
 
Los endpoints `/api/private` y `/api/scoped` requieren un Access Token válido.

**Opción A — Postman**
 
1. Crea un nuevo request `GET`
2. Ve a la pestaña **Authorization**
3. Auth Type: **OAuth 2.0**
4. Haz clic en **Get New Access Token** y llena:


| Campo | Valor |
|-------|-------|
| Grant Type | `Client Credentials` |
| Access Token URL | `https://{tu-dominio}.auth0.com/oauth/token` |
| Client ID | `tu-client-id` |
| Client Secret | `tu-client-secret` |
| Scope | dejar vacío para 403 / `read:reports` para 200 |
| Client Authentication | `Send as Basic Auth header` |
 
5. En **Extra Token Parameters** agrega:
| Key | Value | Send in |
|-----|-------|---------|
| `audience` | `https://api.tu-proyecto.com` | `Request Body` |
 
6. Haz clic en **Get New Access Token** y copia el token
---


**Opción B — curl**
 
Token sin scope (para probar 401/403):
 
```sh
curl -X POST https://{tu-dominio}.auth0.com/oauth/token -H "Content-Type: application/json" -d "{\"client_id\":\"tu-client-id\",\"client_secret\":\"tu-client-secret\",\"audience\":\"https://api.tu-proyecto.com\",\"grant_type\":\"client_credentials\"}"
```
 
Token con scope `read:reports` (para probar 200 en `/api/scoped`):
 
```sh
curl -X POST https://{tu-dominio}.auth0.com/oauth/token -H "Content-Type: application/json" -d "{\"client_id\":\"tu-client-id\",\"client_secret\":\"tu-client-secret\",\"audience\":\"https://api.tu-proyecto.com\",\"grant_type\":\"client_credentials\",\"scope\":\"read:reports\"}"
```
 
Copia el valor de `access_token` de la respuesta.
 
---
 
 
#### Resultados esperados
 
**GET /api/private**
 
| Condición | Respuesta |
|-----------|-----------|
| Sin token | **401** — sin autenticación |
| Con token válido | **200 OK** |
 
**GET /api/scoped**
 
| Condición | Respuesta |
|-----------|-----------|
| Sin token | **401** — sin autenticación |
| Token sin scope `read:reports` | **403** — sin autorización |
| Token con scope `read:reports` | **200 OK** |
 


<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>


---

## Contacto

Joaquin Zárate - <joaquin.zarate@ids.com.mx>

Link del proyecto: [Integración de OAuth 2.0 y OpenID Connect con Auth0](https://github.com/joaquinzarates/track05-auth0-oauth-openID)

<p align="right">(<a href="#readme-top">Regresar al inicio</a>)</p>

---

[nodejs-shield]: https://img.shields.io/badge/Node.js-24.14.1-7bc67e?style=for-the-badge&logo=nodedotjs&logoColor=white
[nodejs-url]: https://nodejs.org
[express-shield]: https://img.shields.io/badge/Express-5.2.1-778ca3?style=for-the-badge&logo=express&logoColor=white
[express-url]: https://expressjs.com
[auth0-shield]: https://img.shields.io/badge/Auth0-Identity-a78bca?style=for-the-badge&logo=auth0&logoColor=white
[auth0-url]: https://auth0.com
[jwt-shield]: https://img.shields.io/badge/JWT-Tokens-5ba4cf?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[jwt-url]: https://jwt.io
[oauth2-shield]: https://img.shields.io/badge/OAuth2-Authorization-e07b6a?style=for-the-badge
[oauth2-url]: https://oauth.net/2/
[openid-shield]: https://img.shields.io/badge/OpenID_Connect-Authentication-e8a87c?style=for-the-badge
[openid-url]: https://openid.net/connect/
[ejs-shield]: https://img.shields.io/badge/EJS-Templates-6db8a8?style=for-the-badge
[ejs-url]: https://ejs.co
[dotenv-shield]: https://img.shields.io/badge/dotenv-Config-e88c8c?style=for-the-badge&logo=dotenv&logoColor=white
[dotenv-url]: https://github.com/motdotla/dotenv
