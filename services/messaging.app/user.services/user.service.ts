import mongoose from "mongoose";
import { autoInjectable, injectable } from "tsyringe";

import { IUserCreatedGroup } from "../../../interfaces/messaging.app/user.interfaces/user.interface";

import { UserCreatedGroupModel } from "../../../Model/messaging.app/user.models/user.model";

import BaseService from "../../base.service";
import GroupService from "../group.services/group.service";

@autoInjectable()
class UserCustomeService {
  constructor() {
    console.log("user service model");
  }

  async createGroup() {
    const session = await mongoose.startSession();
    let groupService = new GroupService ();
    
  }
}

export default UserCustomeService;
