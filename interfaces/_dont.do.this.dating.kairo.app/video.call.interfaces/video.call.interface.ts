import { IBaseModel } from "../../base.mode.interface";

export default interface VideoCallSI extends IBaseModel {
  senderId: any;
  receiverId: any;
  message: String;
}
