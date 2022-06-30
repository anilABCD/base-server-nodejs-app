import { injectable } from "tsyringe";
import QuizeCategorySI from "../interfaces/quize.category.interface";
import QuizeCategoryModel from "../Model/Quize/quize.category.model";
import BaseService from "./base.service";

@injectable()
export default class QuizeCategoryService extends BaseService<QuizeCategorySI> {
  constructor(modelI: QuizeCategoryModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
