import bcrypt from "bcryptjs";
import mongoose, { model } from "mongoose";
import { injectable } from "tsyringe";
import IUser, {
  IUserMethods,
  IUserModel,
} from "../../interfaces/user.interfaces/user.interface";

import { Model } from "mongoose";

import BaseService from "../base.service";

export default class AuthService extends BaseService {
  model: Model<any>;
  constructor(modelI: Model<any>) {
    super(modelI);
    this.model = modelI;
  }
}
