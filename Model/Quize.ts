const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    required: [true, "A quiz shold have a key"],
  },
});

const Quize = mongoose.model("Quiz", quizSchema);

export default Quize;
