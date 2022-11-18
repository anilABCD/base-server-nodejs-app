import { autoInjectable, injectable } from "tsyringe";

import { IUserDetails } from "../../../interfaces/messaging.app/user.interfaces/user.interface";
import { UserDetailsModel } from "../../../Model/messaging.app/user.models/user.details.model";

import BaseService from "../../base.service";

@autoInjectable()
class UserDetailsService extends BaseService<IUserDetails, any, any> {
  constructor(model?: UserDetailsModel) {
    console.log(model, "model");
    super(model);
  }
}

export default UserDetailsService;
