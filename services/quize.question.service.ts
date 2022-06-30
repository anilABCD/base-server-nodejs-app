import { injectable } from "tsyringe";
import QuizeQuestionSI from "../interfaces/quize.question.interface";
import QuizeQuestionModel from "../Model/Quize/quize.question.model";
import BaseService from "./base.service";

@injectable()
export default class QuizeQuestionService extends BaseService<QuizeQuestionSI> {
  constructor(modelI: QuizeQuestionModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
