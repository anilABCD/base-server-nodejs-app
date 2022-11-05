import AppError from "../../ErrorHandling/AppError";
import console from "../../utils/console";

import IUser from "../../interfaces/user.interfaces/user.interface";
import { Roles } from "../../model.types/user.types/user.model.types";
import errorController from "../../ErrorHandling/error.controller";
import MessagingController from "../../controllers/messaging.app/messaging.controllers/messaging.controller";
import isProductionEnvironment from "../../utils/isProductionEnvironment";

import AnyController from "../../controllers/any.controller";
import mongoose from "mongoose";
import { packWithObjectID } from "../../utils/all.util";

/////////////////////////////////////////////////////////////////////////////
// IMPORTANT: NOTE : INFORMATION :  next(err) is called automatically when
// exception is occured .
// if errors are thrown the next(err) is called automatically and
// catched . and we can access them in { extensions : { excepiton : { }  } }
/////////////////////////////////////////////////////////////////////////////

//#endregion Protected Query End

//#region Query Resolvers .

const messagingController = new MessagingController();

const anyController = new AnyController("testing-any-collection");

const resolvers = {
  Query: {
    //
    //
    test_messages: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      let result = await anyController.service?.get();

      return result;
    }),

    messages: protectedQuery(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await anyController.service?.get();
    }),

    message: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.id, context);
      return await anyController.service?.getById(args.id);
    }),

    //   // ****************************************************************************
    //   protectedSampleQuery: protectedQuery(
    //     async (_root: any, {}: any, context: any) => {
    //       return await quizeController.service?.get();
    //     },
    //     "user" // this is a role ... can pass multiple roles ...
    //   ),

    //   quizeCategories: query(async (_root: any, {}: any, context: any) => {
    //     return await quizeController.service?.get();
    //   }),
    //   // ****************************************************************************
    // },

    // QuizeCategory: {
    //   // parent is quizeCategory ...
    //   quizeNames: async (parent: any) => {
    //     console.log("quizeCategory id", parent._id);
    //     return await quizeNameController.service?.getByParent({
    //       quizeCategoryId: parent._id,
    //     });
    //   },
  },

  Mutation: {
    sendMessage: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);
      return await anyController.service?.post({ ...args.input });
    }),
  },
};

//#endregion End Query Resolvers .

//#region Portected Query

const checkAuthenticated = (context: any) => {
  console.log("Check Authenticated");
  if (!context.user) {
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }
};

const restrictTo = (role: Roles, ...roles: String[]) => {
  if (roles.length > 0) {
    let roleIndex: number = parseInt(Roles[role]);
    let userRole = Roles[roleIndex];

    if (!roles.includes(userRole)) {
      throw new AppError(
        "You do not have permission to perform this action",
        403
      );
    }
  }
};

function protectedQuery(
  fn: (_root: any, {}: any, context: any) => Promise<any>,
  ...roles: String[]
): any {
  return async (_root: any, args: any, context: any) => {
    checkAuthenticated(context);
    var userRole: Roles = <Roles>context.user.role;
    restrictTo(userRole, ...roles);
    try {
      return await fn(_root, args, context);
    } catch (err: any) {
      err.statusCode = 400;
      return errorController(err);
    }
  };
}

function query(fn: (_root: any, args: any, context: any) => Promise<any>): any {
  return async (_root: any, args: any, context: any) => {
    try {
      return await fn(_root, args, context);
    } catch (err: any) {
      err.statusCode = 400;
      return errorController(err);
    }
  };
}

function createOrUpdate(
  fn: (_root: any, {}: any, context: any) => Promise<any>,
  ...roles: String[]
): any {
  return async (_root: any, args: any, context: any) => {
    if (isProductionEnvironment()) {
      checkAuthenticated(context);
      var userRole: Roles = <Roles>context.user.role;
      restrictTo(userRole, ...roles);
    }
    try {
      args.input = packWithObjectID(args.input);
      return await fn(_root, args, context);
    } catch (err: any) {
      err.statusCode = 400;
      return errorController(err);
    }
  };
}

export default resolvers;
