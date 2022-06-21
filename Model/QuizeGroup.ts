import mongoose from "mongoose";

const quizGroupSchema = new mongoose.Schema({
  // key :{

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
  // quizQuestions: [],
});

const QuizeGroup = mongoose.model("QuizGroup", quizGroupSchema);

export default QuizeGroup;
