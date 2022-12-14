import mongoose, { Schema } from "mongoose";
import { autoInjectable, injectable } from "tsyringe";
import IGroup from "../../../interfaces/messaging.app/group.interfaces/group.interface";
import { GroupRoles } from "../../../model.types/messaging.app/role.group";
import console from "../../../utils/console";
import AnyService from "../../any.service";
import AuthService from "../../user.services/auth.service";

import { Types } from "mongoose";

import GroupService from "../group.services/group.service";
import UserGroupDetailsService from "./user.details.service";
// import UserCreatedGroupService from "./user.created.group.service";

// let userServiceAny = new AnyService("users");

@autoInjectable()
class UserService {
  constructor() {
    console.log("user service model");
  }

  async getUserGroupDetails() {
    // userServiceAny.model.db.getCollection("user-group-details").aggregate([
    //   { $match: { userId: new Types.ObjectId("637753258b7231ad519c961f") } },
    //   {
    //     $lookup: {
    //       from: "groups",
    //       localField: "groupId",
    //       foreignField: "_id",
    //       as: "group",
    //     },
    //   },
    //   //          {   $unwind:"$userGroupDetails" },
    //   //
    //   //           {
    //   //          $lookup: {
    //   //            from: "groups",
    //   //            localField: "userGroupDetails.groupId",
    //   //            foreignField: "_id",
    //   //            as: "group"
    //   //          }
    //   //         } ,
    //   //           {   $unwind:"$group" },
    //   //        {$wind :"$group}
    // ]);
  }

  async createGroup(groupInput: IGroup, userId: string) {
    const session = await mongoose.startSession();

    session.startTransaction();

    let group: any;
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

      let userGroupDetailsService = new UserGroupDetailsService();

      userGroupDetailsService.post(
        {
          userId: userId,
          groupId: group.id,
          isOwner: true,
          role: GroupRoles[GroupRoles.admin],
          id: "",
        },
        session
      );

      //  let userGroup = await userGroupDetailsService.findOne(
      //     {  groupName: groupInput.groupName },
      //     undefined,
      //     session
      //   );

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
