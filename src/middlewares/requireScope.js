'use strict';

function requireScope(...scopes) {
  return (req, res, next) => {
    const tokenPayload = req.auth;

    if (!tokenPayload) {
      return res.status(401).json({
        error: 'unauthorized',
        message: 'Token de acceso no encontrado.',
      });
    }

    const tokenScopes = (tokenPayload.scope || '').split(' ');
    const hasAllScopes = scopes.every((s) => tokenScopes.includes(s));

    if (!hasAllScopes) {
      return res.status(403).json({
        error: 'insufficient_scope',
        message: `El token no contiene el scope requerido: ${scopes.join(', ')}`,
        required: scopes,
        present: tokenScopes,
      });
    }

    next();
  };
}

module.exports = requireScope;