const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const credentials = require("./credentials");
const authRoutes = require("./routes/authRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));

// Convert the received JSON object from the body of the incoming requests to a JavaScript object and assign it to the "body" attribute of the req object passed to the route handler
app.use(express.json());

// Set this middleware to gain access to a "cookie" method on the response object
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = `mongodb+srv://${credentials.username}:${credentials.password}@cluster0.opd4g.mongodb.net/node-auth`;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000);
    // console.log("Connected to DB!");
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser); // Apply this middleware to all GET request routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// ===== Cookies =====
// app.get("/set-cookies", (req, res) => {
//   // res.setHeader('Set-Cookie', "newUser=true");

//   // If a cookie of the same name already exists, its value will be updated
//   res.cookie("newUser", false);

//   // Third argument of the "cookie" method is an optional option object
//   // maxAge: how long the cookie will last. In this example, it is set to 1 day
//   // secure: cookie is only set if request is made via https
//   // httpOnly: cookie is only accessible via http req/res and not on the client side javascript
//   res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

//   res.send("You got the cookie!");
// });

// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });
