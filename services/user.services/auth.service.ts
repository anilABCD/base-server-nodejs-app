import { Model, model } from "mongoose";
import { injectable } from "tsyringe";
import IUser, {
  IUserMethods,
  UserModel,
} from "../../interfaces/user.interfaces/user.interface";
import UserModelModel from "../../Model/user.models/user.model";
import BaseService from "../base.service";

@injectable()
export default class AuthService extends BaseService<
  IUser,
  UserModel,
  IUserMethods
> {
  model: UserModel;
  constructor(modelI: UserModelModel) {
    super(modelI);
    this.model = modelI.model;
  }

  correctPassword = async (
    candidatePassword: String,
    userPassword: String
  ) => {};

  // changedPasswordAfter = function (JWTTimestamp: number) {
  //   if (this.passwordChangedAt) {
  //     const changedTimestamp = parseInt(
  //       `${this.passwordChangedAt.getTime() / 1000}`,
  //       10
  //     );

  //     return JWTTimestamp < changedTimestamp;
  //   }

  //   // False means NOT changed
  //   return false;
  // };

  // createPasswordResetToken = function () {
  //   const resetToken = crypto.randomBytes(32).toString("hex");

  //   this.passwordResetToken = crypto
  //     .createHash("sha256")
  //     .update(resetToken)
  //     .digest("hex");

  //   // console.log({ resetToken }, this.passwordResetToken);

  //   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  //   return resetToken;
  // };
}
