import mongoose from "mongoose";

export interface BaseModelI extends mongoose.Document {
  createdDate: Date;
  updatedDate: Date;
}
