const express = require("express");
const { GRPC } = require("@cerbos/grpc");
const secured = require("./secured");
const router = express.Router();

const cerbos = new GRPC(
  process.env.CERBOS_INSTANCE, // The Cerbos PDP instance,
  { tls: false }
);

/* GET user profile. */
router.get("/user", secured(), async function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  const profile = {
    ...userProfile,
    // extract the roles from the Auth0 token
    roles: _json["https://cerbos.cloud/roles"] || [],
  };

  // Construct the call to Cerbos using the attributes from the Auth0 token data
  const cerbosPayload = {
    principal: {
      id: profile.id,
      roles: profile.roles,
      attr: {
        email: profile.displayName,
        provider: profile.provider,
      },
    },
    resources: [
      {
        resource: {
          kind: "contact",
          id: "5cc22de4",
          attr: {
            owner: "auth0|6152dcdf1c2789006826dd5c",
            lastUpdated: new Date(2020, 10, 10),
          },
        },
        actions: ["read", "update", "delete"],
      },
      {
        resource: {
          kind: "contact",
          id: "ac29e6df",
          attr: {
            owner: "auth0|6152dcc3ed3a290068aa12c2",
            lastUpdated: new Date(2020, 10, 12),
          },
        },
        actions: ["read", "update", "delete"],
      },
    ],
  };

  const decision = await cerbos.checkResources(cerbosPayload);
  console.log(JSON.stringify(decision.results, 0, 2));

  // Usually check access
  // if (allowed.isAuthorized("contact1", "read")) {
  //   return res.json(contact);
  // } else {
  //   return res.status(403).json({ error: "Unauthorized" });
  // }

  res.render("user", {
    email: `${userProfile.displayName} (ID: ${userProfile.id})`,
    cerbosPayload,
    cerbosResponse: decision.results,
    jwt: profile,
  });
});

module.exports = router;
