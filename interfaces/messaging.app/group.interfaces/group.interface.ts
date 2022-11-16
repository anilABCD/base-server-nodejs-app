import { IBaseModel } from "../../base.mode.interface";

export default interface IGroup extends IBaseModel {
  groupName: String;
  aboutUs: String;
  description: String;

  location: String;
  image?: String;

  interests: String[];

  save(): any;
}
