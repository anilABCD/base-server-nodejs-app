import mongoose, { ObjectId } from "mongoose";
import { Choice, Control, Difficulty } from "../model.types/quize.model.types";
import { BaseMode_With_TimeStamp_I } from "./base.model.timestamp";

export default interface QuizeQuestionSI extends BaseMode_With_TimeStamp_I {
  quizeNameId: ObjectId;

  level: Difficulty;
  options: String[4];
  question: String;
  answer: String;

  control: Control;
  choiceType: Choice;
  active: boolean;
}
