import { ObjectId } from "mongoose";

export default interface QuizeNameSI extends BaseMode_With_TimeStamp_SI {
  name: string;
  quizeId: ObjectId;
}
