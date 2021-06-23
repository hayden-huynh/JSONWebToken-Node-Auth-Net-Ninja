const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// Mongoose hooks are callback functions triggered when a particular event happens in the database e.g. document addition, document deletion, database deletion, etc.

// ===== Trigger a function AFTER a document is saved to the database =====
// userSchema.post("save", function (doc, next) {
//   console.log("A new user was created and saved", doc);

//   // Call next() to continue to send the response back to the client
//   // If not called, a response is generated and the client is left hanging and waiting
//   next();
// });

// ===== Trigger a function BEFORE a document is saved to the database =====
// userSchema.pre("save", function (next) {
//   // The "this" keyword refers to object that is about to be saved to the database. Because the object is not actually saved to the database yet so no reference to it is passed to the callback function and we can only access it via "this"
//   console.log("A new user about to be created and saved", this);
//   next();
// });

// Hash the user's password before saving to the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to log user in
userSchema.statics.login = async function (email, password) {
  // "this" keyword refers to the User model itself
  const user = await this.findOne({ email });
  if (user) {
    // Under the hood, bcrypt hashes the provided password and compare it with the hashed password stored up in the database
    // Auth is a boolean, true if it is a match, false otherwise
    const auth = await bcrypt.compare(password, user.password);
    if (auth) { 
      return user;
    }
    throw Error("Incorrect password");
  } 
  throw Error("Incorrect email address");
};

const User = mongoose.model("user", userSchema);

module.exports = User;
