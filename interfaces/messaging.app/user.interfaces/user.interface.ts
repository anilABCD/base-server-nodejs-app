import { IBaseModel } from "../../base.mode.interface";

interface IUserDetails extends IBaseModel {
  userId: string | undefined;

  createdGroupIds?: String[];
  createdEventIds?: String[];

  favoriteGroupIds?: String[];
  favoriteEventIds?: String[];

  joinedGroupIds?: String[];
  joinedEventIds?: String[];
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
  IUserDetails,
  // IUserJoinedGroup,
  // IUserFavoriteGroup,
  // IUserCreatedEvent,
  // IUserJoinedEvent,
  // IUserFavoriteEvent,
};
