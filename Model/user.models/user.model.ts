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
  phone: {
    type: String,
    unique: true,
    //@ts-ignore
    required: function () {
      //@ts-ignore
      return !this.email; // phoneNumber is required only if email is not provided
    },
    validate: {
      validator: function (value: any) {
        console.log(value);
        // Use validator.isMobilePhone to validate phone numbers
        if (validator.isMobilePhone(value, "en-IN", { strictMode: false })) {
          return true;
        }

        return false;
      },
      message: "Please provide a valid phone number.",
    },
    sparse: true, // Allows multiple documents to have null/empty values for the field
  },
  email: {
    type: String,
    //@ts-ignore
    required: function () {
      //@ts-ignore
      return !this.phone; // phoneNumber is required only if phone is not provided
    },
    lowercase: true,
    unique: true,
    validate: {
      validator: function (value: any) {
        console.log(value);

        if (validator.isEmail(value)) {
          return true;
        }

        return false;
      },
      message: "Please provide a valid email.",
    },
    sparse: true, // Allows multiple documents to have null/empty values for the field
  },

  // phone: {
  //   type: String,
  //   required: [true, "Please provide your phone number"],
  //   lowercase: true,
  //   default: "+919000000000",
  //   validate: {
  //     validator: function (value: any) {
  //       console.log(value);
  //       // Use validator.isMobilePhone to validate phone numbers
  //       return validator.isMobilePhone(value, "en-IN", { strictMode: false });
  //     },
  //     message: "Please provide a valid phone number.",
  //   },
  //   sparse: true, // Allows multiple documents to have no value for the phone field, but ensures uniqueness if present
  // },
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
  technologies: {
    type: [
      {
        type: String,
        enum: [
          "#React",
          "#Angular",
          "#React Native",
          "#Flutter",
          "#iOS",
          "#Android",
          "#Swift",
          "#Swift UI",
          "#Front End",
          "#Backend",
          "#Fullstack",
          "#Dev Ops",
        ], // Use enum values as valid values
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

// Custom validation to ensure that at least one of email or phone number is provided
userSchema.pre("validate", function (this: any, next: any) {
  if (!this.email && !this.phone) {
    next(new Error("At least one of email or phone number is required."));
  } else {
    next();
  }
});

const User = mongoose.model("users", userSchema);

export default User as Model<any>;
