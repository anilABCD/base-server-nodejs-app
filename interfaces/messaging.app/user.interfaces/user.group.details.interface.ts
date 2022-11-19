import { IBaseModel } from "../../base.mode.interface";

interface IUserGroupDetails extends IBaseModel {
  userId: string | undefined;
  groupId: string | undefined;
  role: string;
  isJoined?: boolean;
  isOwner?: boolean;
  isFavorite?: boolean;
}

// interface IUserJoinedGroup extends IBaseModel {
//   userId: any;
//   groupId: any;
// }

// interface IUserFavoriteGroup extends IBaseModel {
//   userId: any;
//   groupId: any;
// }

// interface IUserCreatedEvent extends IBaseModel {
//   userId: any;
//   groupId: any;
// }

// interface IUserJoinedEvent extends IBaseModel {
//   userId: any;
//   groupId: any;
// }

// interface IUserFavoriteEvent extends IBaseModel {
//   userId: any;
//   groupId: any;
// }

export {
  IUserGroupDetails,
  // IUserJoinedGroup,
  // IUserFavoriteGroup,
  // IUserCreatedEvent,
  // IUserJoinedEvent,
  // IUserFavoriteEvent,
};
