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
import GroupService from "../../services/messaging.app/group.services/group.service";
import EventService from "../../services/messaging.app/event.services/event.service";

import UserService from "../../services/messaging.app/user.services/user.service";

/////////////////////////////////////////////////////////////////////////////
// IMPORTANT: NOTE : INFORMATION :  next(err) is called automatically when
// exception is occured .
// if errors are thrown the next(err) is called automatically and
// catched . and we can access them in { extensions : { excepiton : { }  } }
/////////////////////////////////////////////////////////////////////////////

//#endregion Protected Query End

//#region Query Resolvers .

const messagingController = new MessagingController();

const testAnyController = new AnyController("testing-any-collection");

// const groupController = new AnyController("group");
const fieldController = new AnyController("all-fields");

const groupService = new GroupService();

const eventService = new EventService();

const userService = new UserService();

const resolvers = {
  Query: {
    //
    // Sample Code
    test_messages: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      let result = await testAnyController.service?.get();

      return result;
    }),

    messages: protectedQuery(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await testAnyController.service?.get();
    }),

    message: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.id, context);
      return await testAnyController.service?.getById(args.id);
    }),
    // Sample Code End

    groups: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await groupService.get();
    }),
    group: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.id, context);
      return await groupService.getById(args.id);
    }),

    events: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await eventService.get();
    }),

    fields: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await fieldController.service?.get();
    }),

    type: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.typeName, context);
      const response = await fieldController.service?.get({
        typeName: args.typeName,
      });
      console.log(response);
      return response;
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
  },
  Group: {
    // parent is quizeCategory ...
    events: async (parent: any) => {
      console.log("quizeCategory id", parent._id);
      return await eventService.getByParent({
        groupId: parent._id,
      });
    },
  },

  Event: {
    group: async (parent: any) => {
      console.log("quizeCategory id", parent._id);
      return await groupService.getById(parent.groupId);
    },
  },

  Mutation: {
    // Sample Code
    sendMessage: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);
      return await testAnyController.service?.post({ ...args.input });
    }),
    // Sample Code End

    createGroup: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);
      // return await groupService.post({ ...args.input });
      console.log("createGroup");
      return await userService.createGroup({ ...args.input });
    }),

    createEvent: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);
      return await eventService.post({ ...args.input });
    }),

    createField: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);

      let obj = await fieldController.service?.get({
        typeName: args.input.typeName,
        propertyName: args.input.propertyName,
      });

      if (obj && obj?.length == 1) {
        return await fieldController.service?.update(obj[0].id, {
          ...args.input,
        });
      }

      return await fieldController.service?.post({ ...args.input });
    }),

    deleteField: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);

      await fieldController.service?.delete(args.id);

      return { deleted: true };
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
