import { injectable } from "tsyringe";

import QuizeNameSI from "../interfaces/quize.name.interface";
import QuizeNameModel from "../Model/quize.name.model";

import BaseService from "./base.service";

@injectable()
export default class QuizeNameService extends BaseService<QuizeNameSI> {
  constructor(modelI: QuizeNameModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
