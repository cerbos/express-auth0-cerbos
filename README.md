# express-auth0-cerbos

An example application of integrating [Cerbos](https://cerbos.dev) with an [Express](https://expressjs.com/) server using [Auth0](https://auth0.com/) for authentication.

## Dependencies

- Node.js
- Docker for running the [Cerbos Policy Decision Point (PDP)](https://docs.cerbos.dev/cerbos/0.6.0/installation/container.html)
- An Auth0 account if you want to use your own

## Getting Started

1. Start up the Cerbos PDP instance docker container. This will be called by the express app to check authorization.

```bash
cd cerbos
./start.sh
```

2. Install node dependencies

```bash
npm install
```

3. Start the express server

```bash
node index.js
```

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

## Policies

This example has a simple CRUD policy in place for a resource kind of `contact` - like a CRM system would have. The policy file can be found in the `cerbos/policies` folder [here](https://github.com/cerbos/express-auth0-cerbos/blob/main/cerbos/policies/contact.yaml).

Should you wish to experiment with this policy, you can <a href="https://play.cerbos.dev/p/g561543292ospj7w0zOrFx7H5DzhmLu2" target="_blank">try it in the Cerbos Playground</a>.

<a href="https://play.cerbos.dev/p/g561543292ospj7w0zOrFx7H5DzhmLu2" target="_blank"><img src="docs/launch.jpg" height="48" /></a>

The policy expects one of two roles to be set on the principal - `admin` and `user`. These roles are authorized as follows:

| Action | User     | Admin |
| ------ | -------- | ----- |
| list   | Y        | Y     |
| read   | Y        | Y     |
| create | Y        | Y     |
| update | If owner | Y     |
| delete | If owner | Y     |
