const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const Auth0Strategy = require("passport-auth0");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

dotenv.config();

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL ||
      `http://localhost:${process.env.PORT}/callback`,
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

const app = express();

const sess = {
  secret: "CHANGE THIS TO A RANDOM SECRET",
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

app.set("views", "./views");
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRouter);
app.use("/", indexRouter);
app.use("/", usersRouter);

app.listen(process.env.PORT, () => {
  console.log(`Running on http://localhost:${process.env.PORT}`);
});
