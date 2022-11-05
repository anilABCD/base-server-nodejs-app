import { IBaseModel } from "./base.mode.interface";

export default interface AnySI extends IBaseModel {
  senderId: any;
  receiverId: any;
  message: String;
}
