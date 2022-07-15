import AppError from "../ErrorHandling/AppError";
import console from "../utils/console";
import QuizeCategoryController from "../controllers/quize.controllers/quize.category.controller";

/////////////////////////////////////////////////////////////////////////////
// IMPORTANT: NOTE : INFORMATION :  next(err) is called automatically when
// exception is occured .
// if errors are thrown the next(err) is called automatically and
// catched . and we can access them in { extensions : { excepiton : { }  } }
/////////////////////////////////////////////////////////////////////////////

//#region Portected Query

const checkAuthenticated = (context: any) => {
  console.log("Check Authenticated");
  if (context.user) {
  } else {
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }
};

function protectedQuery(
  fn: (_root: any, {}: any, context: any) => Promise<any>
): any {
  return async (_root: any, {}: any, context: any) => {
    checkAuthenticated(context);
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

    quizeCategories: async (_root: any, {}: any, context: any) => {
      return await quizeController.service?.get();
    },
  },
};

//#endregion End Query Resolvers .

export default resolvers;
