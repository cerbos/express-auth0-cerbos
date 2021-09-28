# express-auth0-cerbos

## Auth0 Rule to add roles to token

By default any roles set up in the Auth0 console are not passed through in the authentication token. To enable this, add the following rule to the Auth Pipeline in your Auth0 account.

```js
function (user, context, callback) {
  const namespace = 'https://cerbos.cloud';
  const assignedRoles = (context.authorization || {}).roles;

  let idTokenClaims = context.idToken || {};
  let accessTokenClaims = context.accessToken || {};

  idTokenClaims[`${namespace}/roles`] = assignedRoles;
  accessTokenClaims[`${namespace}/roles`] = assignedRoles;

  context.idToken = idTokenClaims;
  context.accessToken = accessTokenClaims;

  callback(null, user, context);
}
```
