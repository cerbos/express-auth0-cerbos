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
            id: "contact1",
          },
        },
      },
    },
    actions: ["read"],
  };

  const allowed = await cerbos.check(cerbosPayload);

  console.log(allowed);

  res.render("user", {
    email: userProfile.displayName,
    cerbosPayload,
    cerbosResponse: allowed,
    jwt: profile,
  });
});

module.exports = router;
