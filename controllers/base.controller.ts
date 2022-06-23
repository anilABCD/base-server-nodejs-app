import { Request, Response, NextFunction } from "express";
import AppError from "../ErrorHandling/AppError";
import catchAsync from "../ErrorHandling/catchAsync";
import BaseService from "../services/base.service";

export default class BaseController {
  service?: BaseService<any>;

  constructor(service?: BaseService<any>) {
    this.service = service;
    // console.log(
    // "\n\n******** Service injected in controller : ******* \n\n",
    // this.service
    // );
  }

  post = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resource = await this.service?.post(req.body);
    res.status(201).send({
      status: "success",
      data: {
        resource,
      },
    });
  });

  get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const resource = await this.service?.get();

    res.status(200).send({
      status: "success",
      data: {
        resource,
      },
    });
  });

  getById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const resource = await this.service?.getById(id);

      if (!resource) {
        next(new AppError("No data found", 400));
        return;
      }

      res.status(200).send({
        status: "success",
        data: {
          resource,
        },
      });
    }
  );

  patch = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const resource = await this.service?.update(id, req.body);

      res.status(200).json({
        status: "success",
        data: {
          resource,
        },
      });
    }
  );

  delete = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const resource = await this.service?.delete(id);

      res.status(204).send({
        status: "success",
        data: {
          resource,
        },
      });
    }
  );
}
