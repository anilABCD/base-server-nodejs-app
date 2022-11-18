export interface IBaseModel_With_Time extends IBaseModel {
  id: string | undefined;
  createdDate: Date;
  updatedDate: Date;
}

export interface IBaseModel {
  id: string | undefined;
}
