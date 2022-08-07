import { autoInjectable } from "tsyringe";
import MessagingService from "../../../services/messaging.app/messaging.services/messaging.service";
import BaseController from "../../base.controller";

@autoInjectable()
export default class QuizeCategoryController extends BaseController<
  any,
  any,
  any
> {
  constructor(service?: MessagingService) {
    super(service);
  }
}
