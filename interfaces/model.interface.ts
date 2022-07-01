import mongoose from "mongoose";

export default interface ModelI<TIModel, TModel, TIModelMethods> {
  schema: mongoose.Schema<TIModel, TModel, TIModelMethods>;
  model: mongoose.Model<TIModel, {}, TIModelMethods>;
  // Model<IUser, {}, IUserMethods>
}
