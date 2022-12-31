import { ObjectId } from "mongodb";
import { IBaseModel } from "../../base.mode.interface";

export default interface IGroup extends IBaseModel {
  groupName: String;
  aboutUs: String;
  description: String;
  userId: ObjectId;
  location: String;
  image?: String;

  interests: String[];
}
