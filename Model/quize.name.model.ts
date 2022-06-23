import mongoose from "mongoose";

const quizNameSchema = new mongoose.Schema({
  // QuizeCategoryId :{

  // },
  name: {
    type: String,
    unique: true,
    requried: [true, "name is required"],
  },
  level: {
    type: Number,
    default: 1,
    required: [true, "level is required"],
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "difficult"],
    default: "easy",
    required: [true, "difficulty is required"],
  },
});

const QuizeName = mongoose.model("Quize-Name", quizNameSchema);

export default QuizeName;
