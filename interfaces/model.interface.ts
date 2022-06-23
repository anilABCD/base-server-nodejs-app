import mongoose from "mongoose";
import QuizeCategoryI from "./quize.category.interface";

export default interface ModelI {
  schema: mongoose.Schema<any>;
  model: mongoose.Model<any, any>;
}
