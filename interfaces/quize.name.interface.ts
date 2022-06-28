import { ObjectId } from "mongoose";
import { BaseMode_With_TimeStamp_I } from "./base.model.timestamp";

export default interface QuizeNameSI extends BaseMode_With_TimeStamp_I {
  name: string;
  quizeId: ObjectId;
}
