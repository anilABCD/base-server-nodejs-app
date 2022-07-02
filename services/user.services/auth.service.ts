import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { injectable } from "tsyringe";
import IUser, {
  IUserMethods,
  UserDocuemntType,
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

  getDocumentById = async (
    id: string,
    select?: String
  ): Promise<UserDocuemntType> => {
    return await super.getDocumentById(id, select);
  };

  findOneDocument = async (
    filters: any,
    select?: String
  ): Promise<UserDocuemntType> => {
    return await super.findOneDocument(filters, select);
  };
}
