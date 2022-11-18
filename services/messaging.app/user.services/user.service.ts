import mongoose, { Schema } from "mongoose";
import { autoInjectable, injectable } from "tsyringe";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import console from "../../../utils/console";
import AuthService from "../../user.services/auth.service";

import GroupService from "../group.services/group.service";
import UserDetailsService from "./user.details.service";
// import UserCreatedGroupService from "./user.created.group.service";

@autoInjectable()
class UserService {
  constructor() {
    console.log("user service model");
  }

  async createGroup(groupInput: IGroup) {
    const session = await mongoose.startSession();

    session.startTransaction();

    let group: any;

    let userId = "637753258b7231ad519c961f";

    try {
      let groupService = new GroupService();

      await groupService.post(groupInput, session);

      // console.clearAfter("HHHHHHHH");

      group = await groupService.findOne(
        { groupName: groupInput.groupName },
        undefined,
        session
      );

      console.log("group id", group.id);

      let userDetailsService = new UserDetailsService();

      let userDetail = (
        await userDetailsService.getByParent({
          userId: userId,
        })
      )[0];

      console.log(userDetail);
      let userdetailsId;
      if (userDetail === undefined) {
        await userDetailsService.post({ userId: userId, id: "" });

        userDetail = (
          await userDetailsService.getByParent(
            { userId: userId },
            undefined,
            session
          )
        )[0];
      }

      userdetailsId = userDetail.id;

      console.log(userDetail);

      let createdGroupDetails = await userDetailsService.update(
        userdetailsId,
        {
          $push: { createdGroupIds: group.id },
        },
        undefined,
        undefined,
        session
      );

      //@ts-ignore NOTE:SAVE
      await createdGroupDetails.save();

      // Getter/setter for the session associated with this document.
      // assert.ok(user.$session());
      group.description = "updated" + groupInput.description;
      // By default, `save()` uses the associated session

      //@ts-ignore NOTE:SAVE
      await group.save();

      await session.commitTransaction();
    } catch (ex) {
      session.abortTransaction();
      console.log(ex);
      throw "transaction failed" + ex;
    }

    return group as IGroup;
  }
}

export default UserService;

// mongoose : updating or $push in an array
// person.friends.push(friend);
// person.save(done);
// or

// PersonModel.update(
//     { _id: person._id },
//     { $push: { friends: friend } },
//     done
// );
