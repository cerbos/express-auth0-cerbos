const express = require("express");
const { GRPC: Cerbos } = require("@cerbos/grpc");
const secured = require("./secured");
const router = express.Router();

const cerbos = new Cerbos(process.env.CERBOS_INSTANCE, { tls: false });

/* GET user profile. */
router.get("/user", secured(), async function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  const profile = {
    ...userProfile,
    // extract the roles from the Auth0 token
    roles: _json["https://cerbos.cloud/roles"] || [],
  };

  const actions = ["read", "update", "delete"];

  // Construct the call to Cerbos using the attributes from the Auth0 token data
  const cerbosPayload = {
    principal: {
      id: profile.id,
      roles: profile.roles,
      attributes: {
        email: profile.displayName,
        provider: profile.provider,
      },
    },
    resources: [
      {
        resource: {
          kind: "contact",
          id: "5cc22de4",
          attributes: {
            owner: "auth0|6152dcdf1c2789006826dd5c",
            lastUpdated: new Date(2020, 10, 10),
          },
        },
        actions,
      },
      {
        resource: {
          kind: "contact",
          id: "ac29e6df",
          attributes: {
            owner: "auth0|6152dcc3ed3a290068aa12c2",
            lastUpdated: new Date(2020, 10, 12),
          },
        },
        actions,
      },
    ],
    includeMetadata: true,
  };

  const decision = await cerbos.checkResources(cerbosPayload);

  // Usually check access
  // if (decision.isAllowed("read")) {
  //   return res.json(contact);
  // } else {
  //   return res.status(403).json({ error: "Unauthorized" });
  // }

  res.render("user", {
    email: `${userProfile.displayName} (ID: ${userProfile.id})`,
    cerbosPayload,
    cerbosResponse: decision,
    jwt: profile,
  });
});

module.exports = router;
