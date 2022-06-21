import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
  // key :{

  // },
  // groupId:{

  // },
  active: {
    type: Boolean,
    required: [true, "active is required"],
  },
  control: {
    type: String,
    default: "single",
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: Number,
    required: true,
  },
  answerInString: {
    type: String,
    required: true,
  },
});

const quizeQuestion = mongoose.model("QuizQuestion", quizQuestionSchema);

export default quizeQuestion;
