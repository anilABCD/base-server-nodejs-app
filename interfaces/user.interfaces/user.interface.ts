import mongoose, { Model, ObjectId } from "mongoose";
import { Roles } from "../../model.types/user.model.types";
import { BaseModelI } from "../base.mode.interface";

export default interface IUser extends BaseModelI {
  name: String;
  email: String;
  photo: String;
  role?: Roles;
  password: String;
  passwordConfirm?: String;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  active: Boolean;
}

// Put all user instance methods in this interface:
export interface IUserMethods {
  fullName(): string;
  createPasswordResetToken(): string;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  correctPassword(
    candidatePassword: String,
    userPassword: String
  ): Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods...
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  myStaticMethod(): number;
}
