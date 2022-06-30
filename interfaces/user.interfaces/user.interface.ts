import { ObjectId } from "mongoose";
import { Roles } from "../../model.types/user.model.types";
import { BaseModelI } from "../base.mode.interface";

export default interface UserModelSI extends BaseModelI {
  name: String;
  email: String;
  photo: String;
  role: Roles;
  password: String;
  passwordConfirm: String;
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
  active: Boolean;
}
