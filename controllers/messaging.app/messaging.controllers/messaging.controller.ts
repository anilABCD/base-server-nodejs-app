import { autoInjectable } from "tsyringe";
import MessagingService from "../../../services/messaging.app/messaging.services/messaging.service";
import BaseController from "../../base.controller";

@autoInjectable()
export default class MessagingController extends BaseController {
  constructor(service?: MessagingService) {
    super(service);
  }
}
