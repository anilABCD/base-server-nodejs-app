import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../interfaces/model.interface";
import IUser, {
  IUserMethods,
  UserModel,
} from "../../interfaces/user.interfaces/user.interface";
import validator from "validator";
import { Roles } from "../../model.types/user.model.types";

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Create a new Model type that knows about IUserMethods...
@singleton()
export default class UserModelModel
  implements ModelI<IUser, UserModel, IUserMethods>
{
  schema: Schema<IUser, UserModel, IUserMethods> = new mongoose.Schema({
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
        // This only works on CREATE and SAVE!!!
        validator: function (el: String): boolean {
          // @ts-ignore // this.password // CHECK : check once ...
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

  model = model<IUser, UserModel>("users", this.schema);

  constructor() {
    this.schema.pre("save", async function (next) {
      // Only run this function if password was actually modified
      if (!this.isModified("password")) return next();

      // Hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);

      // Delete passwordConfirm field
      this.passwordConfirm = "";
      next();
    });

    this.schema.pre("save", function (next) {
      if (!this.isModified("password") || this.isNew) return next();

      this.passwordChangedAt = new Date(Date.now() - 1000);
      next();
    });

    this.schema.pre(/^find/, function (next) {
      // this points to the current query
      //@ts-ignore
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

    this.schema.methods.fullName = function () {
      return "";
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
