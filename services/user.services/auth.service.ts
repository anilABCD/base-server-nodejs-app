import { injectable } from "tsyringe";
import UserModelSI from "../../interfaces/user.interfaces/user.interface";
import UserModelModel from "../../Model/user.models/user.model";
import BaseService from "../base.service";

@injectable()
export default class AuthService extends BaseService<UserModelSI> {
  constructor(modelI: UserModelModel) {
    super(modelI);
  }
}
