import { autoInjectable } from "tsyringe";
import AnyService from "../services/any.service";
import BaseController from "./base.controller";

export default class AnyController extends BaseController {
  constructor(collectionName: string) {
    let service = new AnyService(collectionName);
    super(service);
  }
}
