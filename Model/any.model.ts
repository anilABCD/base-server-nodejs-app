import { singleton } from "tsyringe";
import mongoose, { model, Model, Schema } from "mongoose";
import ModelI from "../interfaces/model.interface";

import anySchema from "./any.schema";
import AnySI from "../interfaces/any.interface";
import isCurrentApp from "../utils/isCurrentApp";
import console from "../utils/console";

@singleton()
export default class AnyModel implements ModelI<any, any, any> {
  readonly collectionName: string = "";

  schema: Schema<any> = anySchema;
  model: Model<any, any> | null = null;

  constructor(collectionName: string) {
    if (collectionName.trim() === "") {
      const exception = "Mongo DB Collection Name not specified";
      console.error(exception);
      throw exception;
    }

    this.collectionName = collectionName;
    this.model = model<AnySI>(collectionName, this.schema);
  }
}
