import mongoose, { ObjectId } from "mongoose";
import {
  Choice,
  Control,
  Difficulty,
} from "../../../model.types/quize.app/quize.model.types";
import { IBaseModel_With_Time } from "../../base.mode.interface";

export default interface QuizeQuestionSI extends IBaseModel_With_Time {
  quizeNameId: ObjectId;

  level: Difficulty;
  options: String[4];
  question: String;
  answer: String;

  control: Control;
  choiceType: Choice;
  active: boolean;
}
