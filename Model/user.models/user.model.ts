import { Model } from "mongoose";
import { Technology } from "../../interfaces/user.interfaces/user.interface";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");

const {
  Gender,
  Roles,
} = require("../../model.types/user.types/user.model.types");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: {
      values: Object.values(Roles),
      message: "{VALUE} is not supported",
    },
    default: Roles[Roles.user],
    required: [true, "role is required"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: any, el: any) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  gender: {
    type: String,
    enum: {
      values: Object.values(Gender),
      message: "{VALUE} is not supported",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdDate: Date,
  updatedDate: Date,
  experience: {
    type: Number,
    default: 0,
  },
  technology: {
    type: [
      {
        type: String,
        enum: Object.values(Technology), // Use enum values as valid values
      },
    ],
  },
});

// Middleware to hash password before saving
userSchema.pre("save", async function (this: any, next: any) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(String(this.password), 12);
  this.passwordConfirm = ""; // Clear passwordConfirm field
  next();
});

// Middleware to update passwordChangedAt field
userSchema.pre("save", async function (this: any, next: any) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Middleware to exclude inactive users from queries
userSchema.pre(/^find/, async function (this: any, next: any) {
  this.find({ active: { $ne: false } });
  next();
});

// Method to compare password
userSchema.methods.correctPassword = async function (
  candidatePassword: any,
  userPassword: any
) {
  return await bcrypt.compare(String(candidatePassword), String(userPassword));
};

// Method to check if password was changed after JWT token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: any) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${this.passwordChangedAt.getTime() / 1000}`,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to get full name
userSchema.methods.fullName = function () {
  return "anil kumar potlapally";
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("users", userSchema);

export default User as Model<any>;
