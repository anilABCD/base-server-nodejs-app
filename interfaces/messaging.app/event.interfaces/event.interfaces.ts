import { IBaseModel } from "../../base.mode.interface";

export default interface IEvent extends IBaseModel {
  startTime: Date;
  name: String;
  aboutUs: String;
  description: String;
  groupId: any;
  image: String;
}
