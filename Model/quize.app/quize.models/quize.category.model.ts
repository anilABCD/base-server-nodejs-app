import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import QuizeCategorySI from "../../../interfaces/quize.app/quize.interfaces/quize.category.interface";
import quizeCategorySchema from "../../quize.schemas/quize.category.schema";

@singleton()
export default class QuizeCategoryModel implements ModelI<any, any, any> {
  schema: Schema<any> = quizeCategorySchema;

  model: Model<any, any> = model<QuizeCategorySI>(
    "quize-categories",
    this.schema
  );
}
