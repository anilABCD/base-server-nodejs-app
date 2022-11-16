import { IBaseModel } from "../../base.mode.interface";

interface IUserCreatedGroup extends IBaseModel {
  userId: any;
  groupId: any;
}

interface IUserJoinedGroup extends IBaseModel {
  userId: any;
  groupId: any;
}

interface IUserFavoriteGroup extends IBaseModel {
  userId: any;
  groupId: any;
}

interface IUserCreatedEvent extends IBaseModel {
  userId: any;
  groupId: any;
}

interface IUserJoinedEvent extends IBaseModel {
  userId: any;
  groupId: any;
}

interface IUserFavoriteEvent extends IBaseModel {
  userId: any;
  groupId: any;
}

export {
  IUserCreatedGroup,
  IUserJoinedGroup,
  IUserFavoriteGroup,
  IUserCreatedEvent,
  IUserJoinedEvent,
  IUserFavoriteEvent,
};
