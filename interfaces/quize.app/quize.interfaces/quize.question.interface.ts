import mongoose, { ObjectId } from "mongoose";
import {
  Choice,
  Control,
  Difficulty,
} from "../../../model.types/quize.app/quize.model.types";
import { BaseModelI } from "../../base.mode.interface";

export default interface QuizeQuestionSI extends BaseModelI {
  quizeNameId: ObjectId;

  level: Difficulty;
  options: String[4];
  question: String;
  answer: String;

  control: Control;
  choiceType: Choice;
  active: boolean;
}
