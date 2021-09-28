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
        "5cc22de4-30a4-4016-9679-65f054573bd0": {
          attr: {
            owner: "auth0|6152dcdf1c2789006826dd5c",
            lastUpdated: new Date(2020, 10, 10),
          },
        },
        "ac29e6df-ad98-421c-a6b5-2ae3a85dd220": {
          attr: {
            owner: "auth0|6152dcc3ed3a290068aa12c2",
            lastUpdated: new Date(2020, 10, 12),
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
    cerbosResponse: allowed.resp,
    jwt: profile,
  });
});

module.exports = router;
