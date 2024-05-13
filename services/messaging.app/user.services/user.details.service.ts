import { autoInjectable, injectable } from "tsyringe";

import { IUserGroupDetails } from "../../../interfaces/messaging.app/user.interfaces/user.group.details.interface";
import { UserGroupDetailsModel } from "../../../Model/messaging.app/user.models/user.details.model";

import BaseService from "../../base.service";

@autoInjectable()
class UserGroupDetailsService extends BaseService {
  constructor(model?: UserGroupDetailsModel) {
    console.log(model, "model");
    super(model);
  }
}

export default UserGroupDetailsService;
