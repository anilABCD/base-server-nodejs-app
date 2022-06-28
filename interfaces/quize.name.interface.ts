import { ObjectId } from "mongoose";
import { BaseModelI } from "./base.mode.interface";

export default interface QuizeNameSI extends BaseModelI {
  name: string;
  quizeId: ObjectId;
}
