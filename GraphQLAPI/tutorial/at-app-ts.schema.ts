// #region Graph QL

import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

const books = [
  {
    id: 1,
    name: "book 1",
    authorId: 1,
  },
];

const authors = [
  {
    id: 1,
    name: "author 1",
  },
];

const AuthType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: {
      type: GraphQLString,
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: {
      type: GraphQLString,
    },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  description: "RootDescription",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
