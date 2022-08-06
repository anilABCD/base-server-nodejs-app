import { autoInjectable } from "tsyringe";
import QuizeNameService from "../../../services/quize.app/quize.services/quize.name.service";
import BaseController from "../../base.controller";

@autoInjectable()
export default class QuizeNameController extends BaseController<any, any, any> {
  constructor(service?: QuizeNameService) {
    super(service);
  }
}
