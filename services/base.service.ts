import mongoose, { HydratedDocument, Model } from "mongoose";
import ModelI from "../interfaces/model.interface";
import * as utils from "../utils/all.util";

export default class BaseService<
  T,
  T1 extends Model<T, {}, T2> | undefined,
  T2
> {
  model: T1 | undefined;

  constructor(modelI?: ModelI<T, T1, T2>) {
    this.model = modelI?.model;
  }

  post = async (data: any, session?: any) => {
    data = data as T;
    let newObj = utils.addCreatedDate(data);
    let resource = undefined;
    if (session) {
      resource = await this.model?.create(newObj, {
        session: session,
      });
    } else {
      resource = await this.model?.create(newObj);
    }
    return resource;
  };

  get = async (filters = {}, session?: any): Promise<T[]> => {
    if (session) {
      const resource = (await this.model
        ?.find(filters)
        .session(session)) as T[];
      return resource;
    } else {
      const resource = (await this.model?.find(filters)) as T[];
      return resource;
    }
  };

  getById = async (id: string, select?: String, session?: any): Promise<T> => {
    if (session) {
      if (select) {
        return (await this.model
          ?.findOne({
            _id: new mongoose.Types.ObjectId(id),
          })
          .select(select)
          .session(session)) as T;
      }

      return (await this.model
        ?.findOne({
          _id: new mongoose.Types.ObjectId(id),
        })
        .session(session)) as T;
    } else {
      if (select) {
        return (await this.model
          ?.findOne({
            _id: new mongoose.Types.ObjectId(id),
          })
          .select(select)) as T;
      }

      return (await this.model?.findOne({
        _id: new mongoose.Types.ObjectId(id),
      })) as T;
    }
  };

  update = async (
    id: string,
    data: any,
    onlyKeys?: [string],
    removeKeys?: [string],
    session?: any
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

    let resource;

    if (session) {
      resource = await this.model
        ?.findOneAndUpdate({ _id: id }, filteredBody, {
          new: true,
          runValidators: true,
        })
        .session(session);
    } else {
      resource = await this.model?.findOneAndUpdate({ _id: id }, filteredBody, {
        new: true,
        runValidators: true,
      });
    }

    return resource as T;
  };

  delete = async (id: string, session?: any): Promise<any> => {
    if (session) {
      return await this.model
        ?.remove({ _id: new mongoose.Types.ObjectId(id) })
        .session(session);
    } else {
      return await this.model?.remove({ _id: new mongoose.Types.ObjectId(id) });
    }
  };

  //#region Query functions :

  getByParent = async (
    filters: any,
    select?: String,
    session?: any
  ): Promise<T[]> => {
    console.log("parent filters", filters);

    if (session) {
      if (select) {
        return (await this.model
          ?.find(filters)
          .select(select)
          .session(session)) as T[];
      }

      return (await this.model?.find(filters).session(session)) as T[];
    } else {
      if (select) {
        return (await this.model?.find(filters).select(select)) as T[];
      }

      return (await this.model?.find(filters)) as T[];
    }
  };

  findOne = async (
    filters: any,
    select?: String,
    session?: any
  ): Promise<T> => {
    if (session) {
      if (select) {
        return (await this.model
          ?.findOne(filters)
          .select(select)
          .session(session)) as T;
      }

      return (await this.model?.findOne(filters).session(session)) as T;
    } else {
      if (select) {
        return (await this.model?.findOne(filters).select(select)) as T;
      }

      return (await this.model?.findOne(filters)) as T;
    }
  };

  //#region Docuemnt Functions: for methods and static methods ...

  findOneDocument = (filters: any, select?: String, session?: any) => {
    if (session) {
      if (select && select.trim() !== "") {
        return this.model?.findOne(filters).select(select).session(session);
      }

      return this.model?.findOne(filters).session(session);
    } else {
      if (select && select.trim() !== "") {
        return this.model?.findOne(filters).select(select);
      }

      return this.model?.findOne(filters);
    }
  };

  getDocumentById = async (id: string, select?: String, session?: any) => {
    if (session) {
      if (select) {
        return await this.model
          ?.findOne({
            _id: new mongoose.Types.ObjectId(id),
          })
          .select(select)
          .session(session);
      }

      return await this.model
        ?.findOne({
          _id: new mongoose.Types.ObjectId(id),
        })
        .session(session);
    } else {
      if (select) {
        return await this.model
          ?.findOne({
            _id: new mongoose.Types.ObjectId(id),
          })
          .select(select);
      }

      return await this.model?.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
    }
  };
  //#endregion Docuemnt Functions

  //#endregion
}
