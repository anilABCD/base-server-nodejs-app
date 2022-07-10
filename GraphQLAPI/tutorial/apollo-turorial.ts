import { ApolloServer, gql } from "apollo-server";

const typeDefs = gql`
  schema {
    query: Query
  }
  
  type Query {
    greeting: String
  }
`;

const resolvers = {
  Query: {
    greeting: () => "Hello World",
  },
};

// console.log(typeDefs);

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const serrverInfo = await server.listen({ port: 9000 });

  console.log(
    "\n\nApollo Server: \n\nListening on port 9000 \n\n",
    serrverInfo.url
  );
}

startServer();
