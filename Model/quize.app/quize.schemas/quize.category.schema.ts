import mongoose from "mongoose";

let quizeCategorySchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: [true, "is required"],
  },
  createdDate: Date,
  updatedDate: Date,
});

export default quizeCategorySchema;
