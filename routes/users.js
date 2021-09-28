const express = require("express");
const Cerbos = require("cerbos");
const secured = require("./secured");
const router = express.Router();

const cerbos = new Cerbos.Cerbos({
  hostname: "http://localhost:3592", // The Cerbos PDP instance
});

/* GET user profile. */
router.get("/user", secured(), async function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  const profile = {
    ...userProfile,
    roles: _json["https://cerbos.cloud/roles"] || [],
  };

  // Construct the call to Cerbos using the attributes from the Auth0 token data
  const cerbosPayload = {
    principal: {
      id: profile.id,
      roles: profile.roles,
      attr: {
        email: profile.displayName,
      },
    },
    resource: {
      kind: "contact",
      instances: {
        contact1: {
          attr: {
            owner: "auth0|6152dcdf1c2789006826dd5c",
          },
        },
        contact2: {
          attr: {
            owner: "auth0|6152dcc3ed3a290068aa12c2",
          },
        },
      },
    },
    actions: ["read", "create", "update"],
  };

  const allowed = await cerbos.check(cerbosPayload);

  // Usually check access
  // if (allowed.isAuthorized("contact1", "read")) {
  //   return res.json(contact);
  // } else {
  //   return res.status(403).json({ error: "Unauthorized" });
  // }

  res.render("user", {
    email: `${userProfile.displayName} (ID: ${userProfile.id})`,
    cerbosPayload,
    cerbosResponse: allowed,
    jwt: profile,
  });
});

module.exports = router;
