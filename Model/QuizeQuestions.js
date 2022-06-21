"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizQuestionSchema = new mongoose_1.default.Schema({
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
const quizeQuestion = mongoose_1.default.model("QuizQuestion", quizQuestionSchema);
exports.default = quizeQuestion;
