import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../../interfaces/model.interface";
import QuizeQuestionSI from "../../interfaces/quize.interfaces/quize.question.interface";
import { Choice, Control, Difficulty } from "../../model.types/quize.model.types";
import { hasDuplicates } from "../../utils/all.util";

@singleton()
export default class QuizeQuestionModel implements ModelI {
  schema: Schema<any> = new mongoose.Schema({
    quizeNameId: {
      type: Schema.Types.ObjectId,
      required: [true, "is required"],
      ref : "quize-names"
    },
    options: {
      type: Array<String>,
      required: [true, "is required"],
      validate: {
        validator: function (v: Array<String>) {
          if (v) {
            if (v.length !== 4) {
              return false;
            }

            if(hasDuplicates(v)){
              return false;
            }
          }
          return true;
        },
        message: (props : any) =>  { 
          if(props.value.length == 0){
             return "is required";
          }

          if(hasDuplicates(props.value)){
            return "should not have duplicates"
          }
          else{
            return `${props.value.length}should be only 4!`
          }
        },
      },
    },
    question: {
      type: String,
      required: [true, "is required"],
      unique : true,
    },
    answer: {
      type: String,
      required: [true, "is required"],
    },
    level: {
      type: String,
      enum: {
        values: Object.values(Difficulty),
        message: "{VALUE} is not supported",
      },
      default: Difficulty[Difficulty.easy],
      required: [true, "level is required"],
    },
    choiceType: {
      type: String,
      enum: {
        values: Object.values(Choice),
        message: "{VALUE} is not supported",
      },
      default: Choice[Choice.single],
      required: [true, "type is required"],
    },
    control: {
      type: String,
      enum: {
        values: Object.values(Control),
        message: "{VALUE} is not supported",
      },
      default: Control[Control.radio],
      required: [true, "is required"],
    },
    active: {
      type: Boolean,
      required: [true, "is required"],
      default: true,
    },
    createdDate: Date,
    updatedDate: Date,
  });

  model: Model<any, any> = model<QuizeQuestionSI>(
    "quize-questions",
    this.schema
  );
}
