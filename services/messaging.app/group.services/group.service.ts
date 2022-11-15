import { autoInjectable, injectable } from "tsyringe";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import GroupModel from "../../../Model/messaging.app/group.models/group.model";

import BaseService from "../../base.service";

@autoInjectable()
class GroupService extends BaseService<IGroup, any, any> {
  constructor(model?: GroupModel) {
    console.log(model, "model");
    super(model);
  }
}

export default GroupService;
