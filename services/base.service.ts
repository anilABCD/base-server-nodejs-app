import { AnyRecord } from "dns";
import mongoose from "mongoose";
import ModelI from "../interfaces/model.interface";
import filterObject from "../utils/filterObj.util";

export default class BaseService<T> {
  model: mongoose.Model<any, any>;
  constructor(modelI: ModelI) {
    this.model = modelI?.model;
  }

  post = async (data: T) => {
    const resource = await this.model.create(data);

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

  update = async (id: string, data: T, keys?: [string]): Promise<T> => {
    let filteredBody: any;
    if (keys) {
      filteredBody = filterObject(data, ["key"]);
    } else {
      filteredBody = data;
    }
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
