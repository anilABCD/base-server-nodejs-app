import { injectable } from "tsyringe";
import AnySI from "../interfaces/any.interface";
import AnyModel from "../Model/any.model";
import BaseService from "./base.service";
import console from "../utils/console";

@injectable()
export default class AnyService extends BaseService<AnySI, any, any> {
  constructor(collectionName : string) {
    let modelI = new AnyModel(collectionName)
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
