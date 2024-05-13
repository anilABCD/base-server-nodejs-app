import mongoose, {
  FilterQuery,
  HydratedDocument,
  Model,
  UpdateQuery,
  PopulateOptions,
} from "mongoose";
import ModelI from "../interfaces/model.interface";
import * as utils from "../utils/all.util";
import User from "../Model/user.models/user.model";

export default class BaseService {
  model: Model<any>;

  constructor(model: any) {
    this.model = model;
  }

  post = async (data: any, session?: any) => {
    let newObj = utils.addCreatedDate(data);
    let resource = undefined;
    if (session) {
      resource = await this.model?.create([newObj], {
        session: session,
      });
    } else {
      resource = await this.model?.create(newObj);
    }
    return resource;
  };

  get = async (
    filters: FilterQuery<any> = {},
    session?: any
  ): Promise<any[]> => {
    if (session) {
      const resource = await this.model?.find(filters).session(session);
      return resource;
    } else {
      const resource = await this.model?.find(filters);
      return resource;
    }
  };

  getById = async (
    id: string | undefined,
    select?: String,
    session?: any
  ): Promise<any> => {
    if (id === undefined) {
      throw "id is required";
    }

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

  update = async (
    id: string | undefined,
    data: UpdateQuery<any>,
    onlyKeys?: [string],
    removeKeys?: [string],
    session?: any
  ): Promise<any> => {
    // data = data as T;

    if (id === undefined) {
      throw "id is required";
    }

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

    return resource;
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

  populateByFilter = async (
    filters: FilterQuery<any>,
    docs: string,
    options: string | PopulateOptions | PopulateOptions[],
    select?: String
  ): Promise<any> => {
    if (select) {
      return await this.model
        ?.find(filters)
        .populate(docs, options)
        .select(select);
    } else {
      return await this.model?.find(filters).populate(docs, options);
    }
  };

  //#region Query functions :

  getByParent = async (
    filters: FilterQuery<any>,
    select?: String,
    session?: any
  ): Promise<any[]> => {
    console.log("parent filters", filters);

    if (session) {
      if (select) {
        return await this.model?.find(filters).select(select).session(session);
      }

      return await this.model?.find(filters).session(session);
    } else {
      if (select) {
        return await this.model?.find(filters).select(select);
      }

      return await this.model?.find(filters);
    }
  };

  findOne = async (
    filters: FilterQuery<any>,
    select?: String,
    session?: any
  ): Promise<any> => {
    if (session) {
      if (select) {
        return await this.model
          ?.findOne(filters)
          .select(select)
          .session(session);
      }

      return await this.model?.findOne(filters).session(session);
    } else {
      if (select) {
        return await this.model?.findOne(filters).select(select);
      }

      return await this.model?.findOne(filters);
    }
  };

  //#region Docuemnt Functions: for methods and static methods ...

  findOneDocument = (
    filters: FilterQuery<any>,
    select?: String,
    session?: any
  ) => {
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
