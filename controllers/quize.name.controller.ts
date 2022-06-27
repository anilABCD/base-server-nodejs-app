import { autoInjectable } from "tsyringe";
import QuizeNameService from "../services/quize.name.service";
import BaseController from "./base.controller";

@autoInjectable()
export default class QuizeNameController extends BaseController {
  constructor(service?: QuizeNameService) {
    super(service);
  }
}
