import fs, { readdirSync, write } from "fs";
import { compareAndRemoveDuplicates, removeDuplicates } from "./all.util";
import GraphQLUtils from "./GraphQLUtils";

import File from "./File";
import {
  CURRENT_APP,
  Exp_StringTypes,
  FileAndTypesDataInfo,
  Folder_QueriesMutationsTsTemplates_StringType,
  GQL_Scalar_StringTypes,
  GraphQLFile_StringType,
  GraphQLToTS,
  OutPutReactNativeAppPath_StringType,
  PropertyInfo,
  SingleOutFile_StringType,
  TS_StringTypes,
  TypeInfo,
  TypeOfExtesions_StringTypes,
} from "./graphql_types";
import { Dot, NewLine } from "./literal.types";

export default class GqlGenerator {
  generateGraphQLToTs(
    fileNames: string[],
    appName: string,
    singleOutFile: boolean
  ) {
    const fileNameAndDataWithTypes: FileAndTypesDataInfo[] = [];
    let allTypesCombined: TypeInfo[] = [];
    fileNames.forEach((filePath) => {
      //
      //#region File Array Scope
      //

      let filePathToGetTypeAndFolderAndFileName = filePath;
      let allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[] = [];
      let allTypesInSingleFile: string[] = [];
      let typesAndProperties: TypeInfo[] = [];

      const filePathIndex = filePath.lastIndexOf("/");
      if (filePathIndex > -1) {
        filePathToGetTypeAndFolderAndFileName = filePath.substring(
          filePathIndex + 1
        );
      }

      const { typeType, folderToCreate, fileName } = this.getFolderName(
        filePathToGetTypeAndFolderAndFileName
      );

      // For .graphql templates
      if (
        folderToCreate !==
        Folder_QueriesMutationsTsTemplates_StringType(
          "queries.mutation.ts.templates"
        )
      ) {
        const importUrl = this.getImportUrl(folderToCreate, fileName);

        let fileData = "";

        const fileDataArray = fs
          .readFileSync(filePath, { encoding: "utf8", flag: "r" })
          .split(NewLine("\n"));

        let typeAndProperty: TypeInfo = {
          properties: [],
          typeName: "",
          folderToCreate: folderToCreate,
          importUrl: importUrl,
          fileName: fileName,
        };

        let exportData = "";
        fileDataArray.forEach((data, index) => {
          //#region File Data End Scope ...

          data = data.replace("schema", "type Schema ");
          // data = data.replace("input ", "type ");

          // For Non Empty Lines Start Processing the line
          if (data.trim() !== "") {
            if (data.indexOf("type ") > -1) {
              typeAndProperty = {
                properties: [],
                typeName: "",
                folderToCreate: folderToCreate,
                importUrl: importUrl,
                fileName: fileName,
              };

              const typeData = data.split(" ");
              const typeName = typeData[1].trim();
              if (typeName !== Exp_StringTypes("{")) {
                exportData = `export { ${typeName} }`;
                allTypesInSingleFile.push(typeName);
                typeAndProperty.typeName = typeName;
              }
              // console.log(exportData);
            }

            // Int, Float, String, Boolean, and ID, Date

            if (data.indexOf("input ") > -1) {
              typeAndProperty = {
                properties: [],
                typeName: "",
                folderToCreate: folderToCreate,
                importUrl: importUrl,
                fileName: fileName,
              };
              const typeData = data.split(" ");
              const typeName = typeData[1].trim();
              data = data.replace("input ", "type ");
              exportData = `export { ${typeName} }`;
              allTypesInSingleFile.push(typeName);
              typeAndProperty.typeName = typeName;
              // console.log(exportData);
            }

            if (data.indexOf("schema ") > -1) {
              typeAndProperty = {
                properties: [],
                typeName: "",
                folderToCreate: folderToCreate,
                importUrl: importUrl,
                fileName: fileName,
              };
              const typeData = data.split(" ");
              const typeName = typeData[1].trim();
              data = data.replace("schema ", "type ");
              exportData = `export { ${typeName} }`;
              allTypesInSingleFile.push(typeName);
              typeAndProperty.typeName = typeName;
              // console.log(exportData);
            }

            if (data.indexOf("}" as Exp_StringTypes) > -1) {
              if (exportData === "") {
                throw new Error("exportData is empty");
              }

              if (exportData !== "") {
                data += "\r\n\r\n" + exportData + "\r\n\r\n";
                exportData = "";
              }

              const dependentTypes: string[] = [];

              typeAndProperty.properties.forEach((type) => {
                const typeName = type.typeName
                  .trim()
                  .replace("[", "")
                  .replace("]", "")
                  .replace("!", "");
                if (!GraphQLUtils.isScalarType(typeName)) {
                  dependentTypes.push(typeName);
                  typeAndProperty.isPureType = false;
                }
              });

              if (
                typeAndProperty.isPureType === null ||
                typeAndProperty.isPureType === undefined
              ) {
                typeAndProperty.isPureType = true;
              }

              const dependentTypesRemovedDuplicates =
                removeDuplicates(dependentTypes);

              typesAndProperties.push(typeAndProperty);
              typeAndProperty.dependentTypes = dependentTypesRemovedDuplicates;
              console.log("typeAndProperty", typeAndProperty);
            }

            if (!(data.indexOf("}" as Exp_StringTypes) > -1)) {
              if (data.indexOf("{" as Exp_StringTypes) > -1) {
                data = data.replace("{" as Exp_StringTypes, "= { \r\n");
                // if (isType === true) {
                // }
              }

              const lastIndexOfCollon = data.lastIndexOf(
                ":" as Exp_StringTypes
              );

              //
              //  @For NonScalar Types :
              //
              if (
                !(
                  data.indexOf(GQL_Scalar_StringTypes(" ID")) > -1 ||
                  data.indexOf(GQL_Scalar_StringTypes(" String")) > -1 ||
                  data.indexOf(GQL_Scalar_StringTypes(" Float")) > -1 ||
                  data.indexOf(GQL_Scalar_StringTypes(" Boolean")) > -1 ||
                  data.indexOf(GQL_Scalar_StringTypes(" Int")) > -1
                )
              ) {
                if (data.indexOf(":" as Exp_StringTypes) > -1) {
                  const propertyName = data
                    .substring(0, lastIndexOfCollon)
                    .trim();
                  const nonScalarType = data
                    .substring(lastIndexOfCollon + 1)
                    .trim();

                  let propInfo: PropertyInfo = {
                    propertyName: propertyName,
                    typeName: nonScalarType,
                  };

                  allOtherDependentTypesFromPropertyTypesFromOtherFiles.push(
                    nonScalarType
                      .replace("[" as Exp_StringTypes, "")
                      .replace("]" as Exp_StringTypes, "")
                      .replace("!" as Exp_StringTypes, "")
                  );
                  typeAndProperty.properties.push(propInfo);
                }

                //
                // @For functions in graphql : Mutation and Query : types
                //
                if (data.indexOf("(") > -1) {
                  if (
                    typeType === GraphQLFile_StringType("querys.and.mutations")
                  ) {
                    //
                    const indexOfOpenBrace = data.indexOf("(");
                    const indexOfCloseBrace = data.indexOf(")");

                    const params = data.substring(
                      indexOfOpenBrace + 1,
                      indexOfCloseBrace
                    );

                    const paramsArray = params.split("," as Exp_StringTypes);

                    paramsArray.forEach((param) => {
                      if (param !== "") {
                        let collonIndex = param.indexOf(":");

                        param = param.substring(collonIndex + 1);

                        console.log("param", param);
                        allOtherDependentTypesFromPropertyTypesFromOtherFiles.push(
                          GraphQLUtils.getTrimmedType(param)
                        );
                      }
                    });
                    //
                  }
                }
              }

              //
              // @For : Scalar Types :
              //
              if (
                data.indexOf(" ID" as GQL_Scalar_StringTypes) > -1 ||
                data.indexOf(" String" as GQL_Scalar_StringTypes) > -1 ||
                data.indexOf(" Float" as GQL_Scalar_StringTypes) > -1 ||
                data.indexOf(" Boolean" as GQL_Scalar_StringTypes) > -1 ||
                data.indexOf(" Int" as GQL_Scalar_StringTypes) > -1
              ) {
                if (data.indexOf(GQL_Scalar_StringTypes(" ID")) > -1) {
                  data = data.replace(
                    " ID" as GQL_Scalar_StringTypes,
                    TS_StringTypes(" string")
                  );
                  let propInfo: PropertyInfo = {
                    propertyName: data.substring(0, lastIndexOfCollon).trim(),
                    typeName: data.substring(lastIndexOfCollon + 1).trim(),
                  };

                  typeAndProperty.properties.push(propInfo);
                }

                if (data.indexOf(GQL_Scalar_StringTypes(" String")) > -1) {
                  data = data.replace(
                    " String" as GQL_Scalar_StringTypes,
                    TS_StringTypes(" string")
                  );
                  let propInfo: PropertyInfo = {
                    propertyName: data.substring(0, lastIndexOfCollon).trim(),
                    typeName: data.substring(lastIndexOfCollon + 1).trim(),
                  };

                  typeAndProperty.properties.push(propInfo);
                }

                if (data.indexOf(GQL_Scalar_StringTypes(" Float")) > -1) {
                  data = data.replace(
                    " Float" as GQL_Scalar_StringTypes,
                    TS_StringTypes(" number")
                  );
                  let propInfo: PropertyInfo = {
                    propertyName: data.substring(0, lastIndexOfCollon).trim(),
                    typeName: data.substring(lastIndexOfCollon + 1).trim(),
                  };

                  typeAndProperty.properties.push(propInfo);
                }

                if (data.indexOf(GQL_Scalar_StringTypes(" Boolean")) > -1) {
                  data = data.replace(
                    " Boolean" as GQL_Scalar_StringTypes,
                    TS_StringTypes(" boolean")
                  );
                  let propInfo: PropertyInfo = {
                    propertyName: data.substring(0, lastIndexOfCollon).trim(),
                    typeName: data.substring(lastIndexOfCollon + 1).trim(),
                  };

                  typeAndProperty.properties.push(propInfo);
                }

                if (data.indexOf(GQL_Scalar_StringTypes(" Int")) > -1) {
                  data = data.replace(
                    GQL_Scalar_StringTypes(" Int"),
                    TS_StringTypes(" number")
                  );
                  let propInfo: PropertyInfo = {
                    propertyName: data.substring(0, lastIndexOfCollon).trim(),
                    typeName: data.substring(lastIndexOfCollon + 1).trim(),
                  };

                  typeAndProperty.properties.push(propInfo);
                }
              }

              if (!(data.indexOf("{") > -1)) {
                data += ";\r\n";
              }
            }
          }

          // type Mutation = {  sendMessage(input: SendMessageInput): Message;\r\n' +
          // Resultant :
          // const RESULTANT_GQL = gql`
          //   mutation sendMessage($input : SendMessageInput!){
          //         message : sendMessage( input: $input ) {
          //             Message type loop ...
          //        }
          //      }
          //   }
          //`

          if (!(data.indexOf("!") > -1)) {
            if (data.indexOf(":") > -1) {
              data = data.replace(":", "?:");
            }
          } else {
            data = data.replace("!", "");
          }

          fileData += data;
          //#endregion File Data End Scope ...
        });

        // console.log("typesAndProperties", typesAndProperties);

        //#region START File Array Scope after data code ...

        // let typeNameToCreate = "";

        // fileName.split(".").forEach((data) => {
        //   if (data.toLowerCase() !== "graphql")
        //     typeNameToCreate += data.charAt(0).toUpperCase() + data.substring(1);
        // });

        allOtherDependentTypesFromPropertyTypesFromOtherFiles =
          compareAndRemoveDuplicates(
            allOtherDependentTypesFromPropertyTypesFromOtherFiles,
            allTypesInSingleFile
          );

        allOtherDependentTypesFromPropertyTypesFromOtherFiles =
          removeDuplicates(
            allOtherDependentTypesFromPropertyTypesFromOtherFiles
          );

        console.log("allTypesInSingleFile", allTypesInSingleFile);

        allTypesCombined.push(...typesAndProperties);

        const fileAndData: FileAndTypesDataInfo = {
          fileName: fileName + ".ts",
          type: typeType,
          //finalFileDataAsStringWithImportUrls is in next stage ...
          convertedTsDataString: fileData,
          folderToCreate: folderToCreate,
          allTypesInSingleFile: allTypesInSingleFile,
          allTypesInSingleFileCount: allTypesInSingleFile.length,
          typesAndProperties: typesAndProperties,
          typesAndPropertiesCount: typesAndProperties.length,
          importUrl: importUrl,
          allOtherDependentTypesFromPropertyTypesFromOtherFiles:
            allOtherDependentTypesFromPropertyTypesFromOtherFiles,
          // next stage will attach : with import URL's after the file loop
        };

        console.log(
          "AllOtherDependentTypesFromPropertyTypesFromOtherFiles",
          allOtherDependentTypesFromPropertyTypesFromOtherFiles
        );

        fileNameAndDataWithTypes.push(fileAndData);

        //#endregion End File Array Scope after data code ...
      }
      //#endregion End File Array Scope ...
    });

    if (!singleOutFile) {
      fileNameAndDataWithTypes.forEach((fileAndData) => {
        const dependentImportTypesUrls = this.attachDependentTypesToFile(
          fileAndData.allOtherDependentTypesFromPropertyTypesFromOtherFiles,
          allTypesCombined
        );

        const finalFileDataAsStringWithImportUrls =
          dependentImportTypesUrls + fileAndData.convertedTsDataString;

        fileAndData.convertedTsDataString = finalFileDataAsStringWithImportUrls;
      });
    }

    const graphQLToTs: GraphQLToTS = {
      fileNames: fileNames,
      appName: appName,
      fileAndDataWithTypesInfo: fileNameAndDataWithTypes,
    };

    console.log("graphql to ts file generator", graphQLToTs);

    const outputPath =
      "./../base-react-native-app/" +
      "App/" +
      appName +
      "/graphql/graphql.types/";

    let fileAndData = graphQLToTs.fileAndDataWithTypesInfo;
    for (let i = 0; i < graphQLToTs.fileAndDataWithTypesInfo.length; i++) {
      let tsData = fileAndData[i];

      if (tsData.allTypesInSingleFile.length > 0) {
        tsData.allTypesInSingleFile.forEach((inFileTypes) => {
          //
        });
      }
    }

    //#region START Generate gql` query `

    let typeInfosFor_gql_query: TypeInfo[] = [];
    graphQLToTs.fileAndDataWithTypesInfo.forEach((element) => {
      element.typesAndProperties.forEach((type) => {
        let newTypeInfo: TypeInfo = {
          properties: [],
          typeName: "",
          folderToCreate: "",
          importUrl: "",
          fileName: "",
        };

        if (
          !type.typeName.toLowerCase().includes("input") &&
          (type.typeName === "Query" || type.typeName === "Mutation")
          // type.typeName !== "Schema"
        ) {
          console.log("Type Name", type.typeName);

          newTypeInfo.typeName = type.typeName;
          type.properties.forEach((prop) => {
            const propertyTypeName = prop.typeName
              .replace(Exp_StringTypes("["), "")
              .replace(Exp_StringTypes("]"), "")
              .replace(Exp_StringTypes("!"), "");

            if (
              GraphQLUtils.isScalarType(propertyTypeName) &&
              propertyTypeName !== "Query" &&
              propertyTypeName !== "Mutation"
            ) {
            }

            if (
              !GraphQLUtils.isScalarType(propertyTypeName) &&
              propertyTypeName !== "Query" &&
              propertyTypeName !== "Mutation"
            ) {
              newTypeInfo.properties.push(prop);
              // console.log(propertyType);
            }
          });
          if (newTypeInfo.typeName !== "") {
            typeInfosFor_gql_query.push(newTypeInfo);
          }
        }
      });
    });

    console.log("\n********** To Generate GQL : **********\n");

    typeInfosFor_gql_query = typeInfosFor_gql_query.filter((type) => {
      return type.properties.length !== 0;
    });

    typeInfosFor_gql_query.forEach((type) => {
      console.log(type.properties, type.typeName, "\n");
    });

    console.log("\n************* All Types Combined ************\n");

    allTypesCombined =
      this.attachAllPropertyTypesWithOriginalType(allTypesCombined);

    allTypesCombined.forEach((type) => {
      console.log(type);
    });

    this.generate_gql_from_query_mutation(
      typeInfosFor_gql_query,
      allTypesCombined
    );

    //
    // All combined types are here ...
    //
    graphQLToTs.allTypesCombined = allTypesCombined;

    console.log("\n*************************************\n");

    //
    //#endregion END Generate gql` query `
    //
    // `
    //   query {
    //     test_messages {
    //       message
    //       receiverId
    //       senderId
    //     }
    //   }
    //
    // `;
    //

    this.writeGeneratedGraphQLToTsFilesSync(graphQLToTs, singleOutFile);

    return graphQLToTs;
  }
  attachDependentTypesToFile(
    allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[],
    allTypesCombined: TypeInfo[]
  ) {
    let resultImportUrl = "";

    if (allOtherDependentTypesFromPropertyTypesFromOtherFiles.length == 0) {
      resultImportUrl = NewLine("\n");
      return resultImportUrl;
    }

    allOtherDependentTypesFromPropertyTypesFromOtherFiles.forEach(
      (depType, index) => {
        const type = allTypesCombined.filter(
          (type) => type.typeName === depType
        )[0];

        if (index === 0) {
          resultImportUrl = NewLine("\n") + resultImportUrl;
        }

        resultImportUrl +=
          type.importUrl.replace("TYPE_NAME", depType) + NewLine("\n");
      }
    );

    return resultImportUrl;
  }

  // getImportPath / URL
  getImportUrl = (folderToCreate: string, fileName: string) => {
    return (
      'import { TYPE_NAME } from "../' +
      (folderToCreate.trim() !== "" ? folderToCreate + "/" : "") +
      fileName +
      '"'
    );
  };

  getFolderName(fileName: string) {
    // @getFolderName
    let typeType: GraphQLFile_StringType;
    let folderToCreate = "";

    if (
      !(
        fileName.lastIndexOf(TypeOfExtesions_StringTypes(".graphql")) > -1 ||
        fileName.lastIndexOf(TypeOfExtesions_StringTypes(".template")) > -1
      )
    )
      throw new Error(
        `incorrect type of file : not a graphql file ${fileName}`
      );

    if (fileName.indexOf(GraphQLFile_StringType("querys.and.mutations")) > -1) {
      typeType = "querys.and.mutations";

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GraphQLFile_StringType("input")) > -1) {
      typeType = "input";

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GraphQLFile_StringType("type")) > -1) {
      typeType = "type";

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GraphQLFile_StringType("mutation")) > -1) {
      typeType = "mutation";

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else {
      throw new Error("incorect type of file : not a graphql file : phase 2");
    }

    fileName = fileName.substring(0, fileName.lastIndexOf(Dot(".")));
    folderToCreate = folderToCreate.toLowerCase();

    if (folderToCreate === "") {
      if ((typeType = GraphQLFile_StringType("querys.and.mutations"))) {
        folderToCreate = typeType;
      }
    }

    if (
      folderToCreate ===
      Folder_QueriesMutationsTsTemplates_StringType(
        "queries.mutation.ts.templates"
      )
    ) {
      folderToCreate = Folder_QueriesMutationsTsTemplates_StringType(
        "queries.mutation.ts.templates"
      );
    }

    return { folderToCreate, typeType, fileName };
  }

  attachAllPropertyTypesWithOriginalType(allTypesCombined: TypeInfo[]) {
    allTypesCombined.forEach((type) => {
      type.properties.forEach((prop) => {
        //
        if (!GraphQLUtils.isScalarType(prop.typeName)) {
          prop.propertyType = allTypesCombined.filter((types) => {
            return (
              types.typeName === GraphQLUtils.getTrimmedType(prop.typeName)
            );
          })[0];
          prop.propertyTypeAttachedTypeName = prop.propertyType
            ? prop.propertyType?.typeName
            : "";
        }
      });
    });

    return allTypesCombined;
  }

  generate_gql_from_query_mutation(
    queryAndMutationTypesToGenerateGQL: TypeInfo[],
    allTypes: TypeInfo[]
  ) {
    let typeNamesToGenereate_gql: string[] = [];
    queryAndMutationTypesToGenerateGQL.forEach((types) => {
      types.properties.forEach((prop) => {
        const queryAndMutationReturnTypes = GraphQLUtils.getTrimmedType(
          prop.typeName
        );

        typeNamesToGenereate_gql.push(queryAndMutationReturnTypes);
      });
    });
  }

  writeGeneratedGraphQLToTsFilesSync(
    graphQLToTs: GraphQLToTS,
    singleOutFile: boolean
  ) {
    const outFilePathOriginal = OutPutReactNativeAppPath_StringType(
      "./../base-react-native-app/graphql/CURRENT_APP/"
    );

    let outFilePath = outFilePathOriginal.replace(
      CURRENT_APP("CURRENT_APP"),
      graphQLToTs.appName
    );

    if (singleOutFile) {
      outFilePath += SingleOutFile_StringType("/types.ts");

      let outData = "";
      graphQLToTs.fileAndDataWithTypesInfo.forEach((file) => {
        outData += file.convertedTsDataString;
      });

      File.writeToFileSync([outData], outFilePath);
      //
      return;
    }

    if (!singleOutFile) {
      let writeDataArrya: any[] = [];
      let writeData: any = {};
      graphQLToTs.fileAndDataWithTypesInfo.forEach((file) => {
        const folderToCreate = File.path(outFilePath, file.folderToCreate);

        try {
          if (folderToCreate.trim() !== "") {
            File.createDirectorySync(folderToCreate);
          }
        } catch (err) {
          // if unable to create folder then throw the exception ...
          // half work is not great ...
          // than an big issue ...
          throw err;
        }
      });

      graphQLToTs.fileAndDataWithTypesInfo.forEach((file) => {
        writeData = {};

        const filePathToCreate = File.path(
          outFilePath,
          file.folderToCreate,
          file.fileName
        );

        writeData.filePath = filePathToCreate;

        writeData.fileData = file.convertedTsDataString;

        File.writeToFileSync([file.convertedTsDataString], filePathToCreate);

        writeDataArrya.push(writeData);
      });
      console.log("\n******* Write Data ********\n");
      console.log(writeDataArrya);
    }
  }
}
