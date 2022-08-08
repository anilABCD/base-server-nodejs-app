import { ObjectId } from "mongoose";
import { IBaseModel_With_Time } from "../../base.mode.interface";

export default interface QuizeNameSI extends IBaseModel_With_Time {
  name: string;
  quizeCategoryId: ObjectId;
}
