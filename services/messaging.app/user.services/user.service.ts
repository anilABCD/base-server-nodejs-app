import mongoose from "mongoose";
import { autoInjectable, injectable } from "tsyringe";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import console from "../../../utils/console";

import GroupService from "../group.services/group.service";
import UserCreatedGroupService from "./user.created.group.service";

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

    // console.clearAfter("HHHHHHHH");

    const group = await groupService.findOne(
      { groupName: groupInput.groupName },
      undefined,
      session
    );

    console.log("group id", group.id);

    let userCreatedGroupService = new UserCreatedGroupService();

    await userCreatedGroupService.post(
      {
        id: "",
        userId: "637723084b55ed318c050dda",
        groupId: group.id,
      },
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
