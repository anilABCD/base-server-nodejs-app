import mongoose from "mongoose";
import { autoInjectable, injectable } from "tsyringe";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import console from "../../../utils/console";

import GroupService from "../group.services/group.service";

@autoInjectable()
class UserDetailsService {
  constructor() {
    console.log("user service model");
  }

  async createGroup(groupInput: IGroup) {
    const session = await mongoose.startSession();

    session.startTransaction();
    let groupService = new GroupService();

    await groupService.post(groupInput, session);

    console.clearAfter("HHHHHHHH");

    const group = await groupService.findOne(
      { groupName: groupInput.groupName },
      undefined,
      session
    );

    // Getter/setter for the session associated with this document.
    // assert.ok(user.$session());
    group.description = "updated" + groupInput.description;
    // By default, `save()` uses the associated session
    await group.save();

    session.commitTransaction();

    return group as IGroup;
  }
}

export default UserDetailsService;
