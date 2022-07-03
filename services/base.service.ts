import mongoose, { HydratedDocument, Model } from "mongoose";
import ModelI from "../interfaces/model.interface";
import * as utils from "../utils/all.util";

export default class BaseService<T, T1 extends Model<T, {}, T2>, T2> {
  model: T1;

  constructor(modelI: ModelI<T, T1, T2>) {
    this.model = modelI?.model;
  }

  post = async (data: any) => {
    data = data as T;
    let newObj = utils.addCreatedDate(data);
    const resource = await this.model.create(newObj);
    return resource;
  };

  get = async (filters = {}): Promise<T[]> => {
    const resource = (await this.model.find(filters)) as T[];
    return resource;
  };

  getById = async (id: string, select?: String): Promise<T> => {
    if (select) {
      return (await this.model
        .findOne({
          _id: new mongoose.Types.ObjectId(id),
        })
        .select(select)) as T;
    }

    return (await this.model.findOne({
      _id: new mongoose.Types.ObjectId(id),
    })) as T;
  };

  update = async (
    id: string,
    data: any,
    onlyKeys?: [string],
    removeKeys?: [string]
  ): Promise<T> => {
    data = data as T;

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

    return resource as T;
  };

  delete = async (id: string): Promise<any> => {
    return await this.model.remove({ _id: new mongoose.Types.ObjectId(id) });
  };

  //#region Query functions :

  findOne = async (filters: any, select?: String): Promise<T> => {
    if (select) {
      return (await this.model.findOne(filters).select(select)) as T;
    }

    return (await this.model.findOne(filters)) as T;
  };

  //#region Docuemnt Functions: for methods and static methods ...

  findOneDocument = (filters: any, select?: String) => {
    if (select && select.trim() !== "") {
      return this.model.findOne(filters).select(select);
    }

    return this.model.findOne(filters);
  };

  getDocumentById = async (id: string, select?: String) => {
    if (select) {
      return await this.model
        .findOne({
          _id: new mongoose.Types.ObjectId(id),
        })
        .select(select);
    }

    return await this.model.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
  };
  //#endregion Docuemnt Functions

  //#endregion
}
