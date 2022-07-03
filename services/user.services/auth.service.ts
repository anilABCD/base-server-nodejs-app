import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { injectable } from "tsyringe";
import IUser, {
  IUserMethods,
  IUserModel,
} from "../../interfaces/user.interfaces/user.interface";
import UserModelModel from "../../Model/user.models/user.model";
import BaseService from "../base.service";

@injectable()
export default class AuthService extends BaseService<
  IUser,
  IUserModel,
  IUserMethods
> {
  model: IUserModel;
  constructor(modelI: UserModelModel) {
    super(modelI);
    this.model = modelI.model;
  }
}
