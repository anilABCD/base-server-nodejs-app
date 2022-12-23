import AppError from "../../ErrorHandling/AppError";
import console from "../../utils/console";

import fs from "fs";

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
import { GraphQLUpload } from "graphql-upload";
import UserService from "../../services/messaging.app/user.services/user.service";
import UserGroupDetailsService from "../../services/messaging.app/user.services/user.details.service";
import path from "path";
import { extractObjectId } from "../../utils/extractObjectId";
// import { GraphQLUpload } from "graphql-upload";
/////////////////////////////////////////////////////////////////////////////
// IMPORTANT: NOTE : INFORMATION :  next(err) is called automatically when
// exception is occured .
// if errors are thrown the next(err) is called automatically and
// catched . and we can access them in { extensions : { excepiton : { }  } }
/////////////////////////////////////////////////////////////////////////////

//#endregion Protected Query End

//#region Query Resolvers .

const messagingController = new MessagingController();

const userGroupDetails = new UserGroupDetailsService();

const testAnyController = new AnyController("testing-any-collection");

// const groupController = new AnyController("group");
const fieldController = new AnyController("all-fields");

const indexController = new AnyController("all-indexes");

const groupService = new GroupService();

const eventService = new EventService();

const userService = new UserService();

const resolvers = {
  Query: {
    //
    // // Sample Code
    // test_messages: query(async (_root: any, args: any, context: any) => {
    //   // console.log("params", _root, args, context);
    //   let result = await testAnyController.service?.get();

    //   return result;
    // }),

    // messages: protectedQuery(async (_root: any, args: any, context: any) => {
    //   // console.log("params", _root, args, context);
    //   return await testAnyController.service?.get();
    // }),

    // message: query(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args.id, context);
    //   return await testAnyController.service?.getById(args.id);
    // }),
    // // Sample Code End

    userGroupsDetails: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.id, context);

      let response = await userGroupDetails.model
        .find({
          userId: context.user._id,
        })
        .populate("groupId");

      console.log(response);

      return response;
    }),

    groups: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await groupService.get();

      // Samples for example :
      // let response = await groupService.model.aggregate([
      //   // {
      //   //   $group: {
      //   //     _id: {
      //   //       id: "$_id",
      //   //       groupName: "$groupName",
      //   //       aboutUs: "$aboutUs",
      //   //       description: "$description",
      //   //       location: "$location",
      //   //     },
      //   //   },
      //   // },

      //   // {
      //   //   $project: {
      //   //     _id: 0,
      //   //     id: "$_id.id",
      //   //     groupName: "$_id.groupName",
      //   //     aboutUs: "$_id.aboutUs",
      //   //     description: "$_id.description",
      //   //     location: "$_id.location",
      //   //   },
      //   // },
      //   // { $sort: { groupName: 1 } },
      //   // { $limit: req.query.limit | limit }
      //   // {
      //   //   $project: {
      //   //     id: 1,
      //   //     grouName: 1,
      //   //   },
      //   // },

      //   {
      //     $project: {
      //       _id: 0,
      //       id: "$_id",
      //       groupName: 1,
      //       aboutUs: 1,
      //       description: 1,
      //       location: 1,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "user-group-details",
      //       localField: "_id",
      //       foreignField: "_id",
      //       as: "joinedGroups",
      //     },
      //   },

      //   // { $limit: 5 },
      // ]);
    }),

    // userDetails : query(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args.id, context);
    //   return await userService.
    // }),

    group: query(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args.id, context);
      return await groupService.getById(args.id);
    }),

    events: query(async (_root: any, args: any, context: any) => {
      // console.log("params", _root, args, context);
      return await eventService.get();
    }),

    ////////////////////////////////// fields project.

    // fields: query(async (_root: any, args: any, context: any) => {
    //   // console.log("params", _root, args, context);
    //   return await fieldController.service?.get();
    // }),

    // indexes: query(async (_root: any, args: any, context: any) => {
    //   // console.log("params", _root, args, context);
    //   return await indexController.service?.get();
    // }),

    // type: query(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args.typeName, context);
    //   const fields = await fieldController.service?.get({
    //     typeName: args.typeName,
    //   });

    //   const indexes = await indexController.service?.get({
    //     typeName: args.typeName,
    //   });
    //   const result = {
    //     fields: fields,
    //     indexes: indexes,
    //   };
    //   // console.log(result);
    //   return result;
    // }),

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
      console.log("group id", parent._id);
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
  Upload: GraphQLUpload,
  Mutation: {
    // // Sample Code
    // sendMessage: createOrUpdate(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args, context);
    //   return await testAnyController.service?.post({ ...args.input });
    // }),
    // // Sample Code End

    // Owner group is not saved here .
    // Only favorite and unfavorite and joined and unjoined
    saveUserGroupDetails: createOrUpdate(
      async (_root: any, args: any, context: any) => {
        console.log("params", _root, args, context);
        return await userGroupDetails.post({ ...args.input });
      }
    ),

    createGroup: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);
      // return await groupService.post({ ...args.input });
      console.log("createGroup");

      return await userService.createGroup({ ...args.input }, context.user.id);
    }),

    createEvent: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, args, context);

      const groupDetails = await userGroupDetails.getByParent({
        userId: new mongoose.Types.ObjectId(context.user.id),
        isOwner: true,
      });

      console.log(groupDetails);

      if (groupDetails.length > 0) {
        let gds = groupDetails.filter((gd) => {
          return (
            extractObjectId(gd.groupId) === extractObjectId(args.input.groupId)
          );
        });

        if (gds.length === 1) {
          console.log("success");
          return await eventService.post({ ...args.input });
        }
      }

      return null;
    }),

    updateEvent: createOrUpdate(async (_root: any, args: any, context: any) => {
      console.log("params", _root, JSON.stringify(args), context);

      const eventId = context.headers["id-"];
      const result = await uploadFileOrImage(args.file);

      let imageUrl = result.url;

      return await eventService.update(eventId, { image: imageUrl }, ["image"]);
    }),

    singleUpload: createOrUpdate(
      async (_root: any, args: any, context: any) => {
        console.log(args);
        return await uploadFileOrImage(args.file);
      }
    ),

    ////////////////////////////////////// Filed realated othe project ////////////

    // createField: createOrUpdate(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args, context);

    //   let obj = await fieldController.service?.get({
    //     typeName: args.input.typeName,
    //     propertyName: args.input.propertyName,
    //   });

    //   if (obj && obj?.length == 1) {
    //     return await fieldController.service?.update(obj[0].id, {
    //       ...args.input,
    //     });
    //   }

    //   return await fieldController.service?.post({ ...args.input });
    // }),

    // deleteField: createOrUpdate(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args, context);

    //   await fieldController.service?.delete(args.id);

    //   return { deleted: true };
    // }),

    // createIndex: createOrUpdate(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args, context);
    //   return await indexController.service?.post({ ...args.input });
    // }),

    // deleteIndex: createOrUpdate(async (_root: any, args: any, context: any) => {
    //   console.log("params", _root, args, context);

    //   await indexController.service?.delete(args.id);

    //   return { deleted: true };
    // }),
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
      console.log("args", args);
      if (!args.file) {
        args.input = packWithObjectID(args.input);
      }

      const response = await fn(_root, args, context);
      return response;
    } catch (err: any) {
      err.statusCode = 400;
      return errorController(err);
    }
  };
}

const uploadFileOrImage = async (
  file: any,
  isImage: boolean = true,
  publicFolderName: string = ""
) => {
  const { createReadStream, filename, mimetype, encoding } = await file;

  let publicFolder = publicFolderName;
  if (isImage === true) {
    publicFolder = "images";
  }
  debugger;
  const stream = createReadStream();
  console.log("directory name", __dirname);

  let dotdotPath = "/../../..";
  if (isProductionEnvironment()) {
    dotdotPath = "/../..";
  }

  const pathName = `${__dirname}${dotdotPath}/public/${publicFolder}/${filename}`;

  await stream
    .pipe(
      fs.createWriteStream(pathName).on("error", function (err: any) {
        console.log("stream.createWriteStream error", err);
        errorController(err);
      })
    )
    .on("error", function (err: any) {
      console.log("stream.pipe error", err);
      errorController(err);
    });

  return {
    filename,
    mimetype,
    url: `http://localhost:5000/images/${filename}`,
    encoding,
  };
};

export default resolvers;
