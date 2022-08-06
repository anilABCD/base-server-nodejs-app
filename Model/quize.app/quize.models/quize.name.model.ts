import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";
import QuizeNameSI from "../../../interfaces/quize.app/quize.interfaces/quize.name.interface";

@singleton()
export default class QuizeNameModel implements ModelI<any, any, any> {
  schema: Schema<any> = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    quizeCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "quize-categories",
    },
    createdDate: Date,
    updatedDate: Date,
  });

  model: Model<any, any> = model<QuizeNameSI>("quize-name", this.schema);
}
