import { autoInjectable, injectable } from "tsyringe";

import { IUserCreatedGroup } from "../../../interfaces/messaging.app/user.interfaces/user.interface";

import { UserCreatedGroupModel } from "../../../Model/messaging.app/user.models/user.model";

import BaseService from "../../base.service";

@autoInjectable()
class UserGroupService extends BaseService<IUserCreatedGroup, any, any> {
  constructor(model?: UserCreatedGroupModel) {
    console.log(model, "model");
    super(model);
  }
}

export default UserGroupService;
