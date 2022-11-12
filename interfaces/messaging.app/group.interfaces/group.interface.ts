import { IBaseModel } from "../../base.mode.interface";

export default interface IGroup extends IBaseModel {
  id: String;
  groupName: String;
  description: String;
  location: String;
  interests?: [String];
}
