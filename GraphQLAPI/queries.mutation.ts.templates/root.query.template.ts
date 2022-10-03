//
// import BaseGraphQLQueryService from "../../base.graphql.query.service";
// import base_query_type from "../../common/base.query.type";
// import MyQueryKeyOfType from "../../common/QueryKeyOfType";
// import { Schema } from "./querys.and.mutations";
//
// class root_type implements base_query_type {
//   type: Schema | undefined;
//   /* Replace test_message with current project Query key */
//   name: MyQueryKeyOfType = "test_messages";
//   input = undefined;
//   queries?: BaseGraphQLQueryService<Schema, Schema["query"] | undefined>;
//   isRootQuery = true;
//
//   constructor() {
//     this.queries = new BaseGraphQLQueryService(this);
//   }
//
//   async query(query: Schema) {
//     return await this.queries?.query(query);
//   }
//
// }
//

// export default root_type;
