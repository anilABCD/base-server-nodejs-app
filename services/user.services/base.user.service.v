import { AnyRecord } from "dns";
import mongoose from "mongoose";
import BaseService from "../base.service";
import ModelI from "../../interfaces/model.interface";
import * as utils from "../../utils/all.util";
import IUser, {
  IUserDocument,
} from "../../interfaces/user.interfaces/user.interface";

export default class UserBaseService extends BaseService<UserModelSI> {
  constructor(modelI: ModelI) {
    super(modelI);
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

  getById = async (id: string, select?: String): Promise<T> => {
    if (select) {
      return (await this.model
        .find({
          _id: new mongoose.Types.ObjectId(id),
        })
        .select(select)) as T;
    }

    return (await this.model.find({
      _id: new mongoose.Types.ObjectId(id),
    })) as T;
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

  //#region  Other functions

  findOne = (filters: any, select?: String): Promise<T> => {
    if (select) {
      return this.model.findOne(filters).select(select);
    }

    return this.model.findOne(filters);
  };

  //#endregion
}
