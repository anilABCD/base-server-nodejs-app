import { ObjectId } from "mongoose";

export default interface QuizeNameSI {
  name: string;
  quizeId: ObjectId;
}
