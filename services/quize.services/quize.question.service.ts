import { injectable } from "tsyringe";
import QuizeQuestionSI from "../../interfaces/quize.interfaces/quize.question.interface";
import QuizeQuestionModel from "../../Model/quize.models/quize.question.model";
import BaseService from "../base.service";

@injectable()
export default class QuizeQuestionService extends BaseService<
  QuizeQuestionSI,
  any,
  any
> {
  constructor(modelI: QuizeQuestionModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
