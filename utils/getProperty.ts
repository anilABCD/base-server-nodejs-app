function getProperty<T, K extends keyof T>(obj: T, ...key: K[]) {
  // getProperty
  return `{ 
    ${key.join("\n")}
  }`;
}

//////////////////////////////////////////////
//
// type Query = {
//   test_messages?: Message[];
//   messages?: [Message];
// };
//
// export { Query };
//
// let query: Query = {
//
// }
//
// getProperty(query, "test_messages" )
//////////////////////////////////////////////

export default getProperty;
