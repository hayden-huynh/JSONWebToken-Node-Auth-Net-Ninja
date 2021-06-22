const express = require("express");
const mongoose = require("mongoose");

const credentials = require("./credentials");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(express.static("public"));

// Convert the received JSON object from the body of the incoming requests to a JavaScript object and assign it to the "body" attribute of the req object passed to the route handler
app.use(express.json());

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
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));

app.use(authRoutes);
