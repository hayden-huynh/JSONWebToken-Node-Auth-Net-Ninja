const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { secret } = require("../credentials");

// Handle errors
const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // Incorrect email
  if (err.message === "Incorrect email address") {
    errors.email = "Email address is not yet registered";
  }

  // Incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "Password is incorrect";
  }

  // Duplication of email address Error
  if (err.code === 11000) {
    errors.email = "The provided email is already taken";
    return errors;
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  // The Headers of the token are automatically applied
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  // Cannot literally delete the token but can reset its value to nothing and set it to expire immediately
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
