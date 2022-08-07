import { injectable } from "tsyringe";
import MessagingSI from "../../../interfaces/messaging.app/messaging.interfaces/messaging.interface";
import MessagingModel from "../../../Model/messaging.app/messaging.models/messaging.model";
import BaseService from "../../base.service";
import console from "../../../utils/console";

@injectable()
export default class MessagingService extends BaseService<
  MessagingSI,
  any,
  any
> {
  constructor(modelI: MessagingModel) {
    super(modelI);
    //console.log("\n\n****** Model injected in service : ****** \n\n", modelI);
  }
}
