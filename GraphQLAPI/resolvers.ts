import AppError from "../ErrorHandling/AppError";
import console from "../utils/console";
import QuizeCategoryController from "../controllers/quize.controllers/quize.category.controller";
import IUser from "../interfaces/user.interfaces/user.interface";
import { Roles } from "../model.types/user.model.types";

/////////////////////////////////////////////////////////////////////////////
// IMPORTANT: NOTE : INFORMATION :  next(err) is called automatically when
// exception is occured .
// if errors are thrown the next(err) is called automatically and
// catched . and we can access them in { extensions : { excepiton : { }  } }
/////////////////////////////////////////////////////////////////////////////

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
  return async (_root: any, {}: any, context: any) => {
    checkAuthenticated(context);
    var userRole: Roles = <Roles>context.user.role;
    restrictTo(userRole, ...roles);
    return await fn(_root, {}, context);
  };
}

//#endregion Protected Query End

//#region Query Resolvers .

const quizeController = new QuizeCategoryController();

const resolvers = {
  Query: {
    // someField : protectedQuery(
    //   async (_root: any, {}: any, context: any) => {
    //     return await someService().
    //   }
    // ),

    quizeCategories: protectedQuery(
      async (_root: any, {}: any, context: any) => {
        return await quizeController.service?.get();
      },
      "admin"
    ),
  },
};

//#endregion End Query Resolvers .

export default resolvers;
