"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const quizGroupSchema = new mongoose_1.default.Schema({
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
const QuizeGroup = mongoose_1.default.model("QuizGroup", quizGroupSchema);
exports.default = QuizeGroup;
