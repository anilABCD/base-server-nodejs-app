import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../interfaces/model.interface";
import UserModelSI from "../../interfaces/user.interfaces/user.interface";
import validator from "validator";

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

@singleton()
export default class UserModelModel implements ModelI {
  schema: Schema<any> = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
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
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
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
        // This only works on CREATE and SAVE!!!
        validator: function (el: String) {
          // @ts-ignore // this.password // NOTE: check once ...
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    createdDate: Date,
    updatedDate: Date,
  });

  model: Model<any, any> = model<UserModelSI>("users", this.schema);

  constructor() {
    this.schema.pre("save", async function (next) {
      // Only run this function if password was actually modified
      if (!this.isModified("password")) return next();

      // Hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);

      // Delete passwordConfirm field
      this.passwordConfirm = undefined;
      next();
    });

    this.schema.pre("save", function (next) {
      if (!this.isModified("password") || this.isNew) return next();

      this.passwordChangedAt = Date.now() - 1000;
      next();
    });

    this.schema.pre(/^find/, function (next) {
      // this points to the current query
      this.find({ active: { $ne: false } });
      next();
    });

    this.schema.methods.correctPassword = async function (
      candidatePassword: String,
      userPassword: String
    ) {
      return await bcrypt.compare(candidatePassword, userPassword);
    };

    this.schema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
      if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
          `${this.passwordChangedAt.getTime() / 1000}`,
          10
        );

        return JWTTimestamp < changedTimestamp;
      }

      // False means NOT changed
      return false;
    };

    this.schema.methods.createPasswordResetToken = function () {
      const resetToken = crypto.randomBytes(32).toString("hex");

      this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // console.log({ resetToken }, this.passwordResetToken);

      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

      return resetToken;
    };
  }
}
