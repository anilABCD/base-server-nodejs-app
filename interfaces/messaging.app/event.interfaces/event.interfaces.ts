import { IBaseModel } from "../../base.mode.interface";

export default interface IEvent extends IBaseModel {
  eventName: String;
  aboutUs: String;
  description: String;
  role: String;
  groupId: any;
  image: String;
  startDate: Date;
  startTime: Date;
  timeZoneOffset: Number;
  isOnline: Boolean;
}
