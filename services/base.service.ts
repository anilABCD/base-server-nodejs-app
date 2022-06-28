import { AnyRecord } from "dns";
import mongoose from "mongoose";
import ModelI from "../interfaces/model.interface";
import * as utils from "../utils/all.util";

export default class BaseService<T> {
  model: mongoose.Model<any, any>;
  constructor(modelI: ModelI) {
    this.model = modelI?.model;
  }

  post = async (data: T) => {
    let newObj = utils.addCreatedDate(data);
    const resource = await this.model.create(newObj);
    return resource;
  };

  get = async (filters = {}): Promise<T[]> => {
    const resource = (await this.model.find(filters)) as T[];
    return resource;
  };

  getById = async (id: string): Promise<T> => {
    const resource = (await this.model.find({
      _id: new mongoose.Types.ObjectId(id),
    })) as T;
    return resource;
  };

  update = async (
    id: string,
    data: T,
    onlyKeys?: [string],
    removeKeys?: [string]
  ): Promise<T> => {
    let filteredBody: any;
    if (onlyKeys) {
      filteredBody = utils.filterObject(data, onlyKeys);
    } else {
      filteredBody = data;
    }

    filteredBody = utils.removeProperty(filteredBody, ["createdDate"]);
    filteredBody = utils.addUpdateDate(filteredBody);

    const resource = await this.model.findOneAndUpdate(
      { _id: id },
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    return resource;
  };

  delete = (id: string): void => {
    return this.model.remove({ _id: new mongoose.Types.ObjectId(id) });
  };
}
