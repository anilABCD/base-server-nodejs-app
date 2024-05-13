import { autoInjectable, injectable } from "tsyringe";

import IEvent from "../../../interfaces/messaging.app/event.interfaces/event.interfaces";
import EventModel from "../../../Model/messaging.app/event.models/event.model";

import BaseService from "../../base.service";

@autoInjectable()
class EventService extends BaseService {
  constructor(model?: EventModel) {
    console.log(model, "model");
    super(model);
  }
}

export default EventService;
