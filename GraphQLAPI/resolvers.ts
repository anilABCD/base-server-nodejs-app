import AppError from "../ErrorHandling/AppError";
import console from "../utils/console";

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

function protectedQuery(fn: (_root: any, {}: any, context: any) => any): any {
  return (_root: any, {}: any, context: any) => {
    checkAuthenticated(context);
    return fn(_root, {}, context);
  };
}

//#endregion Protected Query End

//#region Query Resolvers .

const resolvers = {
  Query: {
    greeting: protectedQuery((_root: any, {}: any, context: any) => {
      return "New Hello World";
    }),
  },
};

//#endregion End Query Resolvers .

export default resolvers;
