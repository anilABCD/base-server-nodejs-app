import mongoose, { Model, ObjectId } from "mongoose";
import { Gender, Roles } from "../../model.types/user.types/user.model.types";
import { IBaseModel_With_Time } from "../base.mode.interface";

export enum Technology {
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
}

export default interface IUser extends IBaseModel_With_Time {
  _id?: string;
  name: String;
  email: String;
  photo: String;
  role?: Roles;
  password: String;
  passwordConfirm?: String;
  passwordChangedAt?: Date;
  passwordResetToken?: String;
  passwordResetExpires?: Date;
  gender?: Gender;
  active: Boolean;
  experience: number;
  technology: Technology[];
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
