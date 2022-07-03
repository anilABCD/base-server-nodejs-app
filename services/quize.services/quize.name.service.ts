import { injectable } from "tsyringe";

import QuizeNameSI from "../../interfaces/quize.interfaces/quize.name.interface";
import QuizeNameModel from "../../Model/quize.models/quize.name.model";

import BaseService from "../base.service";

import console from "../../utils/console";

@injectable()
export default class QuizeNameService extends BaseService<
  QuizeNameSI,
  any,
  any
> {
  constructor(modelI: QuizeNameModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
