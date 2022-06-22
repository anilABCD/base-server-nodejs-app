import mongoose from "mongoose";
const quizCategorySchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: [true, "A quiz shold have a key"],
  },
});

const QuizeCategory = mongoose.model("Quize-Category", quizCategorySchema);

export default QuizeCategory;
