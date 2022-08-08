import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../../interfaces/model.interface";

import QuizeCategorySI from "../../../interfaces/quize.app/quize.interfaces/quize.category.interface";
import quizeCategorySchema from "../quize.schemas/quize.category.schema";
import isCurrentApp from "../../../utils/isCurrentApp";

@singleton()
export default class QuizeCategoryModel implements ModelI<any, any, any> {
  schema: Schema<any> = quizeCategorySchema;

  model: Model<any, any> | null = isCurrentApp("QuizeApp")
    ? model<QuizeCategorySI>("quize-categories", this.schema)
    : null;
}
