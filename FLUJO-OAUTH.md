# Flujo Oauth 
## Sección 1: Gráfico del flujo

![Diagrama Authorization Code + PKCE](https://www.plantuml.com/plantuml/png/PP31JiCm38RlUGfhrmrjuhW3MYW8LHnMmU0q2LcfjqLaJkMa4_3qj6iJiN7ixw-_FsSL8afiZqwXYLxWBRGergkcIwsn3NA4IU4iSQG9O83YSgJRU5YS1_fgK9L3N9LAZQrmSmS5BA7hCq0CpkyjgoB5JyGa2CRNz74YiJjBikNl8J07T8vuJmElU_vn0tFi1BpO7zhoz8g4AOI8aPJk_qWEIwYGOuSWr3GgfDbON0ZLnCQYew1qqdkXw8K7lroTvT_FmWPJdhggzMjd6VqdSJA4wUMDIYSub-GR_gyl7s2JshGn5CBmFQwiolmoZPqtOayOgMVl2OLaP7iiqtdhpieHPrks8Sm0ste6zDKazg_3xM81wsUr8gxRe_i5)

## Sección 2: Flujo paso a paso
**Paso 1 — Generación de PKCE**
 
El cliente genera un `code_verifier` aleatorio y calcula el `code_challenge`:
```
El `code_verifier` nunca sale del cliente hasta el Token Request.
```
**Paso 2 — Authorization Request**
 
El cliente redirige al usuario a Auth0 con:
- `response_type=code`
- `code_challenge` y `code_challenge_method=S256`
- `state` aleatorio
- `scope=openid profile email read:reports`
- `audience`

**Paso 3 — Autenticación**
Auth0 presenta la pantalla de login. El usuario ingresa sus credenciales.

**Paso 4 — Redirect con código**
Auth0 redirige al callback con `?code=AUTH_CODE&state=MISMO_STATE`.

**Paso 5 — Verificación del state**
El cliente compara el `state` recibido con el generado. Si no coinciden no se ejecuta — posible ataque CSRF.

**Paso 6 — Token Request**
El cliente envía al Token Endpoint:
- `code`
- `code_verifier`
- `client_id` y `client_secret`

Auth0 verifica que `SHA256(code_verifier) == code_challenge`.

**Paso 7 — Respuesta con tokens** 
Auth0 devuelve el `ID Token` y el `Access Token`.

**Paso 8 — Acceso a la API**
El cliente envía el `Access Token` como `Bearer` en cada petición a la API.

**Paso 9 — Validación del token**
La API verifica firma, `iss`, `aud` y `exp` usando el JSON Web Key Set de Auth0. 
### Sección 3: ID Token y Access Token
 
| | ID Token | Access Token |
|--|----------|--------------|
| **Protocolo** | OpenID Connect | OAuth 2.0 |
| **Propósito** | Autenticar al usuario | Autorizar acceso a recursos |
| **Destinatario** | La app cliente | La API |
| **Enviar a la API** | Nunca | Sí, como Bearer |
| **Contiene** | `sub`, `name`, `email` | `sub`, `scope`, `aud`, `iss`, `exp` |
 
---
 
### Sección 4: Rol de cada parámetro
 
| Parámetro | Función |
|-----------|---------|
| `state` | Valor aleatorio para prevenir CSRF. El cliente verifica que el devuelto coincida con el enviado |
| `code_verifier` | Secreto local aleatorio. Permanece en el cliente hasta el Token Request |
| `code_challenge` | Hash del `code_verifier` (`BASE64URL(SHA256(code_verifier))`). Se envía a Auth0 en el Authorization Request |
| `code_challenge_method` | Siempre `S256`. Indica que se usa SHA-256 |
| `response_type` | `code` indica que se espera un código de autorización |
| `scope` | Permisos solicitados. `openid` activa OIDC y la emisión del ID Token |
| `audience` | En él se establece para qué API se solicita el Access Token. Se convierte en el claim `aud` |
| `code` | Código temporal que devuelve Auth0. Se intercambia por los tokens en el backend |
 
---
