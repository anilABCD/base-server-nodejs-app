import { BaseModelI } from "./base.mode.interface";

export interface BaseMode_With_TimeStamp_I extends BaseModelI {
  createdDate?: Date;
  updatedDate?: Date;
}
