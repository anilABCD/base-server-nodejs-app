import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";
import { GroupRoles } from "../../../model.types/messaging.app/role.group";
import { IUserGroupDetails } from "../../../interfaces/messaging.app/user.interfaces/user.group.details.interface";
import isCurrentApp from "../../../utils/isCurrentApp";

////////////////// User Groups /////////////////

@singleton()
class UserGroupDetailsModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    role: {
      type: String,
      enum: {
        values: Object.values(GroupRoles),
        message: "{VALUE} is not supported",
      },
      default: GroupRoles[GroupRoles.user],
      required: [true, "role is required"],
    },

    groupId: { type: Schema.Types.ObjectId, ref: "groups" },

    isJoined: { type: Schema.Types.Boolean },
    isOwner: { type: Schema.Types.Boolean },
    isFavorite: { type: Schema.Types.Boolean },
  });

  model: Model<any, any> | null = isCurrentApp("messaging-app")
    ? model<IUserGroupDetails>("user-group-details", this.schema)
    : null;
}

// @singleton()
// class UserFavoriteGroupModel implements ModelI<any, any, any> {
//   schema: Schema<any> = new mongoose.Schema({
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//     },

//     groupId: {
//       type: Schema.Types.ObjectId,
//       ref: "groups",
//     },
//   });

//   model: Model<any, any> | null = isCurrentApp("messaging-app")
//     ? model<IUserFavoriteGroup>("user-favorite-groups", this.schema)
//     : null;
// }

// @singleton()
// class UserJoinedGroupModel implements ModelI<any, any, any> {
//   schema: Schema<any> = new mongoose.Schema({
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//     },

//     groupId: {
//       type: Schema.Types.ObjectId,
//       ref: "groups",
//     },
//   });

//   model: Model<any, any> | null = isCurrentApp("messaging-app")
//     ? model<IUserJoinedGroup>("user-joined-groups", this.schema)
//     : null;
// }

// /////////////////////// User EVENTS ////////////////////////

// @singleton()
// class UserCreatedEventModel implements ModelI<any, any, any> {
//   schema: Schema<any> = new mongoose.Schema({
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//     },

//     groupId: {
//       type: Schema.Types.ObjectId,
//       ref: "groups",
//     },
//   });

//   model: Model<any, any> | null = isCurrentApp("messaging-app")
//     ? model<IUserCreatedEvent>("user-created-events", this.schema)
//     : null;
// }

// @singleton()
// class UserFavoriteEventModel implements ModelI<any, any, any> {
//   schema: Schema<any> = new mongoose.Schema({
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//     },

//     groupId: {
//       type: Schema.Types.ObjectId,
//       ref: "groups",
//     },
//   });

//   model: Model<any, any> | null = isCurrentApp("messaging-app")
//     ? model<IUserFavoriteEvent>("user-favorite-events", this.schema)
//     : null;
// }

// @singleton()
// class UserJoinedEventModel implements ModelI<any, any, any> {
//   schema: Schema<any> = new mongoose.Schema({
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "users",
//     },

//     groupId: {
//       type: Schema.Types.ObjectId,
//       ref: "groups",
//     },
//   });

//   model: Model<any, any> | null = isCurrentApp("messaging-app")
//     ? model<IUserJoinedEvent>("user-joined-events", this.schema)
//     : null;
// }

export { UserGroupDetailsModel };
