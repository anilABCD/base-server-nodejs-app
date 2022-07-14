import console from "../utils/console";

const resolvers = {
  Query: {
    greeting: (_root: any, {}, context: any) => {
      if (context.user) {
        console.log("\nProtected GraphQL Route\n");
      }

      return "New Hello World";
    },
  },
};

export default resolvers;
