import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import { IUserDetails } from "../../../interfaces/messaging.app/user.interfaces/user.interface";
import isCurrentApp from "../../../utils/isCurrentApp";

////////////////// User Groups /////////////////

@singleton()
class UserDetailsModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    createdGroupIds: [{ type: Schema.Types.ObjectId, ref: "groups" }],
    createdEventIds: [{ type: Schema.Types.ObjectId, ref: "events" }],

    favoriteGroupIds: [{ type: Schema.Types.ObjectId, ref: "groups" }],
    favoriteEventIds: [{ type: Schema.Types.ObjectId, ref: "events" }],

    joinedGroupIds: [{ type: Schema.Types.ObjectId, ref: "groups" }],
    joinedEventIds: [{ type: Schema.Types.ObjectId, ref: "events" }],
  });

  model: Model<any, any> | null = isCurrentApp("messaging-app")
    ? model<IUserDetails>("user-details", this.schema)
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

export { UserDetailsModel };
