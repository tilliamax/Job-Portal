// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const expressHandlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");

// Requiring passport as we've configured it
const passport = require("./config/passport");


// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8070;
const db = require("./models");
const { urlencoded } = require("express");
const cookieParser = require("cookie-parser");


// Creating express app and configuring middleware needed for authentication
const app = express();
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(urlencoded({ extended : false}))
app.use(cookieParser())




// Set Handlebars.
app.engine(
  "handlebars",
  expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/user-routes.js")(app);
require("./routes/jobs-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
