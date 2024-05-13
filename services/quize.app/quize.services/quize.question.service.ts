import { injectable } from "tsyringe";
import QuizeQuestionSI from "../../../interfaces/quize.app/quize.interfaces/quize.question.interface";
import QuizeQuestionModel from "../../../Model/quize.app/quize.models/quize.question.model";
import BaseService from "../../base.service";

import console from "../../../utils/console";

export default class QuizeQuestionService extends BaseService {
  constructor(modelI: QuizeQuestionModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
