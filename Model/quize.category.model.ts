import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../interfaces/model.interface";

import QuizeCategorySI from "../interfaces/quize.category.interface";

@singleton()
export default class QuizeCategoryModel implements ModelI {
  schema: Schema<any> = new mongoose.Schema({
    key: {
      type: String,
      unique: true,
      required: [true, "key is required"],
    },
    createdDate: {
      type: Date,
      required: [true, "created date is required"],
    },
    updatedDate: {
      type: Date,
    },
  });

  model: Model<any, any> = model<QuizeCategorySI>(
    "quize-categories",
    this.schema
  );
}
