import { IBaseModel } from "../../base.mode.interface";

export default interface IEvent extends IBaseModel {
  name: String;
  aboutUs: String;
  description: String;
  groupId: any;
  image: String;
  startDate: Date;
  startTime: Date;
  timeZoneOffset: Number;
  isOnline: Boolean;
}
