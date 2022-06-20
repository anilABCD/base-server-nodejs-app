const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: [true, "A quiz shold have a key"],
  },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
