var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
const auth_secret = require("../config/secret");
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  hash: String,
  salt: String,
  token: String,
  eid: String,
  confirmationId: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  delegate: { type: Schema.ObjectId, ref: "User" },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  },
  line_manager: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  line_manager: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  firstname: String,
  lastname: String,
  phone: String,
  city: String,
  type: String,
  created: Date,
  updated: { type: Date, default: Date.now }
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      fullname: this.firstname + " " + this.lastname,
      department: this.department,
      type: this.type,
      exp: parseInt(expiry.getTime() / 1000)
    },
    auth_secret
  ); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

userSchema.methods.getUser = function(token) {
  const striped_token = token.replace("Bearer ", "");
  return jwt.decode(striped_token, auth_secret);
};

// module.exports = User = mongoose.model("User", userSchema);
mongoose.model("User", userSchema);
