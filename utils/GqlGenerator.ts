import fs, { readdirSync, write } from "fs";
import { compareAndRemoveDuplicates, removeDuplicates } from "./all.util";
import GraphQLUtils from "./GraphQLUtils";

import File, { FileParams } from "./File";
import {
  ExportSyntax,
  ExpressionChar,
  FileAndTypesDataInfo,
  FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations,
  GQL_Input,
  GQL_Root_Type,
  GQL_ScalarType,
  GQL_Type,
  GQLFileType,
  From_GQL_Type,
  GraphQLToTS,
  OutPathReactNative_AppName,
  PropertyInfo,
  SingleTypeScriptOutFile,
  TO_TS_Type,
  TypeInfo,
  TypeOfExtesions_StringTypes,
  ExpressionToTS,
  TS_ScalarTypes,
  FileExtension,
  GLQ_Files_Excluded,
  OUTPUT_QUERIES_AND_MUTATIN_TS_FOLDER_PATH,
  QUERIES_MUTATION_TS_FOLDER,
  GQL_SERVER_OUTPUT_PATH_COMBINED_FILE,
  SingleTypeMutationAndQueriesScriptOutFile,
  QUERIES_MUTATION_TS_TEMPLATE_FILE_PATH,
  QUERY_PROPERTY_NAME,
  MUTATION_PROPERTY_NAME,
} from "./graphql_types";
import { Comment, Dot, Empty, NewLine, PathChar, Space } from "./literal.types";
import console from "./console";

export default class GqlGenerator {
  generateAllCombinedGrqphQLSchema(fileNames: string[], appName: string) {
    const data_combinedFromAllGraphqlFiles = File.getFilesDataSync(
      fileNames,
      ["graphql"],
      GLQ_Files_Excluded
    );

    console.log("Complete GraphQL Data : ", data_combinedFromAllGraphqlFiles);

    File.writeToFileSync(
      data_combinedFromAllGraphqlFiles,
      File.path(
        GQL_SERVER_OUTPUT_PATH_COMBINED_FILE(
          "./GraphQLAPI/CURRENT_APP/schema.graphql",
          appName
        )
      )
    );

    return data_combinedFromAllGraphqlFiles;
  }

  generateGraphQLToTs(
    fileNames: string[],
    appName: string,
    singleOutFile: boolean
  ) {
    // fileNames = compareAndRemoveDuplicates(fileNames, GLQ_Files_Excluded);

    const fileNameAndDataWithTypes: FileAndTypesDataInfo[] = [];
    let allTypesCombined: TypeInfo[] = [];

    fileNames.forEach((filePathEach) => {
      //
      // ".ts"
      console.log(filePathEach);
      if (filePathEach.lastIndexOf(FileExtension(".ts")) > -1) {
        console.log(".ts skipped.", filePathEach);
        return;
      } else {
        console.log(".ts not skipped.", filePathEach);
      }

      let toSkip: boolean | undefined = undefined;
      GLQ_Files_Excluded.forEach((excludeFile) => {
        if (filePathEach.lastIndexOf(excludeFile) > -1) {
          toSkip = true;
        }
      });

      if (toSkip === true) {
        console.log("Files skipped by gql : ", filePathEach);
        return;
      } else {
        console.log("Files not skipped by gql : ", filePathEach);
      }

      //
      //#region File Array Scope
      //

      let filePathToGetTypeAndFolderAndFileName = filePathEach;
      let allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[] = [];
      let allTypesInSingleFile: string[] = [];
      let typesAndProperties: TypeInfo[] = [];

      const filePathIndex = filePathEach.lastIndexOf(PathChar("/"));
      if (filePathIndex > -1) {
        filePathToGetTypeAndFolderAndFileName = filePathEach.substring(
          filePathIndex + 1
        );
      }

      const { typeType, folderToCreate, fileName } = this.getFolderName(
        filePathToGetTypeAndFolderAndFileName
      );

      // For .graphql templates

      const importUrl = this.getImportUrl(folderToCreate, fileName);

      let fileData = "";

      const fileDataArray = fs
        .readFileSync(filePathEach, { encoding: "utf8", flag: "r" })
        .split(NewLine("\n"));

      let typeAndProperty: TypeInfo = {
        properties: [],
        typeName: "",
        folderToCreate: folderToCreate,
        importUrl: importUrl,
        fileName: fileName,
      };

      let exportData = "";
      fileDataArray.forEach((dataEachLine, index) => {
        //#region File Data End Scope ...

        let isNullProperty = false;
        let isArrayProperty = false;

        ///EXP
        // if (dataEachLine.indexOf("(") > -1) {
        let line = dataEachLine;

        let typeIndex = line.lastIndexOf(":");
        if (typeIndex > -1) {
          line = line.substring(typeIndex);

          if (line.includes("[]")) {
            isArrayProperty = true;
          }

          if (!line.includes(ExpressionChar("!"))) {
            isNullProperty = true;
          }
        }

        if (!line.includes(ExpressionChar("!"))) {
          isNullProperty = true;
        }
        // }
        ///EXP

        dataEachLine = dataEachLine.replace(
          From_GQL_Type("schema "),
          TO_TS_Type("type Schema ")
        );
        // data = data.replace("input ", "type ");

        // For Non Empty Lines Start Processing the line
        if (dataEachLine.trim() !== Empty("")) {
          if (dataEachLine.indexOf(GQL_Type("type ")) > -1) {
            typeAndProperty = {
              properties: [],
              typeName: Empty(""),
              folderToCreate: folderToCreate,
              importUrl: importUrl,
              fileName: fileName,
            };

            const typeData = dataEachLine.split(Space(" "));
            const typeName = typeData[1].trim();
            if (typeName !== ExpressionChar("{")) {
              exportData = ExportSyntax("export { TYPE_NAME } ", typeName);
              // exportData = `export { ${typeName} }`;
              allTypesInSingleFile.push(typeName);
              typeAndProperty.typeName = typeName;
            }
            // console.log(exportData);
          }

          // Int, Float, String, Boolean, and ID, Date

          if (dataEachLine.indexOf(GQL_Input("input ")) > -1) {
            typeAndProperty = {
              properties: [],
              typeName: "",
              folderToCreate: folderToCreate,
              importUrl: importUrl,
              fileName: fileName,
            };
            const typeData = dataEachLine.split(" ");
            const typeName = typeData[1].trim();
            dataEachLine = dataEachLine.replace(
              GQL_Input("input "),
              TO_TS_Type("type ")
            );
            exportData = ExportSyntax("export { TYPE_NAME } ", typeName);
            allTypesInSingleFile.push(typeName);
            typeAndProperty.typeName = typeName;
            // console.log(exportData);
          }

          if (dataEachLine.indexOf(From_GQL_Type("schema ")) > -1) {
            typeAndProperty = {
              properties: [],
              typeName: "",
              folderToCreate: folderToCreate,
              importUrl: importUrl,
              fileName: fileName,
            };
            const typeData = dataEachLine.split(Space(" "));
            const typeName = typeData[1].trim();
            dataEachLine = dataEachLine.replace(
              From_GQL_Type("schema "),
              TO_TS_Type("type ")
            );
            exportData = ExportSyntax("export { TYPE_NAME } ", typeName);
            allTypesInSingleFile.push(typeName);
            typeAndProperty.typeName = typeName;
            // console.log(exportData);
          }

          if (dataEachLine.indexOf(ExpressionChar("}")) > -1) {
            if (exportData === Empty("")) {
              throw new Error("exportData is empty");
            }

            if (exportData !== "") {
              dataEachLine +=
                NewLine("\r\n", 2) + exportData + NewLine("\r\n", 2);
              exportData = "";
            }

            const dependentTypes: string[] = [];

            typeAndProperty.properties.forEach((type) => {
              const typeName = type.typeName
                .trim()
                .replace(ExpressionChar("["), Empty(""))
                .replace(ExpressionChar("]"), Empty(""))
                .replace(ExpressionChar("!"), Empty(""));
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

            console.log("Type And Property", typeAndProperty);
          }

          if (!(dataEachLine.indexOf(ExpressionChar("}")) > -1)) {
            if (dataEachLine.indexOf(ExpressionChar("{")) > -1) {
              dataEachLine = dataEachLine.replace(
                ExpressionChar("{"),
                ExpressionToTS("= { \r\n")
              );
              // if (isType === true) {
              // }
            }

            const lastIndexOfCollon = dataEachLine.lastIndexOf(
              ExpressionChar(":")
            );

            //
            //  @For NonScalar Types :
            //
            if (
              !(
                dataEachLine.indexOf(GQL_ScalarType(" ID")) > -1 ||
                dataEachLine.indexOf(GQL_ScalarType(" String")) > -1 ||
                dataEachLine.indexOf(GQL_ScalarType(" Float")) > -1 ||
                dataEachLine.indexOf(GQL_ScalarType(" Boolean")) > -1 ||
                dataEachLine.indexOf(GQL_ScalarType(" Int")) > -1
              )
            ) {
              if (dataEachLine.indexOf(ExpressionChar(":")) > -1) {
                const propertyName = dataEachLine
                  .substring(0, lastIndexOfCollon)
                  .trim();
                const nonScalarType = dataEachLine
                  .substring(lastIndexOfCollon + 1)
                  .trim();

                let propInfo: PropertyInfo = {
                  propertyName: propertyName,
                  typeName: nonScalarType,
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                // console.log("NONSCALAR", propertyName, nonScalarType);

                //EXP
                let nonScalarTypes: string[] = [];
                if (nonScalarType.includes(",")) {
                  nonScalarTypes = nonScalarType.split(",");
                  nonScalarTypes.forEach((nonScalar, index) => {
                    nonScalarTypes[index] =
                      GraphQLUtils.getTrimmedType(nonScalar);

                    allOtherDependentTypesFromPropertyTypesFromOtherFiles.push(
                      nonScalarTypes[index]
                        .replace(ExpressionChar("["), Empty(""))
                        .replace(ExpressionChar("]"), Empty(""))
                        .replace(ExpressionChar("!"), Empty(""))
                    );
                  });
                } else {
                  //EXP
                  allOtherDependentTypesFromPropertyTypesFromOtherFiles.push(
                    nonScalarType
                      .replace(ExpressionChar("["), Empty(""))
                      .replace(ExpressionChar("]"), Empty(""))
                      .replace(ExpressionChar("!"), Empty(""))
                  );
                }
                typeAndProperty.properties.push(propInfo);
              }

              //
              // @For functions in graphql : Mutation and Query : types
              //
              if (dataEachLine.indexOf(ExpressionChar("(")) > -1) {
                if (typeType === GQLFileType("querys.and.mutations")) {
                  //
                  const indexOfOpenBrace = dataEachLine.indexOf(
                    ExpressionChar("(")
                  );
                  const indexOfCloseBrace = dataEachLine.indexOf(
                    ExpressionChar(")")
                  );

                  const params = dataEachLine.substring(
                    indexOfOpenBrace + 1,
                    indexOfCloseBrace
                  );

                  const paramsArray = params.split(ExpressionChar(","));

                  paramsArray.forEach((param) => {
                    if (param !== Empty("")) {
                      let collonIndex = param.indexOf(ExpressionChar(":"));

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
              dataEachLine.indexOf(GQL_ScalarType(" ID")) > -1 ||
              dataEachLine.indexOf(GQL_ScalarType(" String")) > -1 ||
              dataEachLine.indexOf(GQL_ScalarType(" Float")) > -1 ||
              dataEachLine.indexOf(GQL_ScalarType(" Boolean")) > -1 ||
              dataEachLine.indexOf(GQL_ScalarType(" Int")) > -1
            ) {
              if (dataEachLine.indexOf(GQL_ScalarType(" ID")) > -1) {
                dataEachLine = dataEachLine.replace(
                  GQL_ScalarType(" ID"),
                  TS_ScalarTypes(" string")
                );
                let propInfo: PropertyInfo = {
                  propertyName: dataEachLine
                    .substring(0, lastIndexOfCollon)
                    .trim(),
                  typeName: dataEachLine
                    .substring(lastIndexOfCollon + 1)
                    .trim(),
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                typeAndProperty.properties.push(propInfo);
              }

              if (dataEachLine.indexOf(GQL_ScalarType(" String")) > -1) {
                dataEachLine = dataEachLine.replace(
                  GQL_ScalarType(" String"),
                  TS_ScalarTypes(" string")
                );
                let propInfo: PropertyInfo = {
                  propertyName: dataEachLine
                    .substring(0, lastIndexOfCollon)
                    .trim(),
                  typeName: dataEachLine
                    .substring(lastIndexOfCollon + 1)
                    .trim(),
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                typeAndProperty.properties.push(propInfo);
              }

              if (dataEachLine.indexOf(GQL_ScalarType(" Float")) > -1) {
                dataEachLine = dataEachLine.replace(
                  GQL_ScalarType(" Float"),
                  TS_ScalarTypes(" number")
                );
                let propInfo: PropertyInfo = {
                  propertyName: dataEachLine
                    .substring(0, lastIndexOfCollon)
                    .trim(),
                  typeName: dataEachLine
                    .substring(lastIndexOfCollon + 1)
                    .trim(),
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                typeAndProperty.properties.push(propInfo);
              }

              if (dataEachLine.indexOf(GQL_ScalarType(" Boolean")) > -1) {
                dataEachLine = dataEachLine.replace(
                  GQL_ScalarType(" Boolean"),
                  TS_ScalarTypes(" boolean")
                );

                let propInfo: PropertyInfo = {
                  propertyName: dataEachLine
                    .substring(0, lastIndexOfCollon)
                    .trim(),
                  typeName: dataEachLine
                    .substring(lastIndexOfCollon + 1)
                    .trim(),
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                typeAndProperty.properties.push(propInfo);
              }

              if (dataEachLine.indexOf(GQL_ScalarType(" Int")) > -1) {
                dataEachLine = dataEachLine.replace(
                  GQL_ScalarType(" Int"),
                  TS_ScalarTypes(" number")
                );

                let propInfo: PropertyInfo = {
                  propertyName: dataEachLine
                    .substring(0, lastIndexOfCollon)
                    .trim(),
                  typeName: dataEachLine
                    .substring(lastIndexOfCollon + 1)
                    .trim(),
                  isNull: isNullProperty,
                  isArray: isArrayProperty,
                };

                typeAndProperty.properties.push(propInfo);
              }
            }

            if (!(dataEachLine.indexOf(ExpressionChar("{")) > -1)) {
              dataEachLine += ExpressionChar(";") + NewLine("\r\n");
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

        // ! meaning non null
        if (!(dataEachLine.indexOf(ExpressionChar("!")) > -1)) {
          if (dataEachLine.indexOf(ExpressionChar(":")) > -1) {
            dataEachLine = dataEachLine.replace(
              ExpressionChar(":"),
              ExpressionToTS("?:")
            );
          }
        } else {
          dataEachLine = dataEachLine.replace(ExpressionChar("!"), "");
        }

        fileData += dataEachLine;
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

      allOtherDependentTypesFromPropertyTypesFromOtherFiles = removeDuplicates(
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
          (type.typeName === GQL_Root_Type("Query") ||
            type.typeName === GQL_Root_Type("Mutation"))
          // type.typeName !== "Schema"
        ) {
          console.log("Type Name", type.typeName);

          newTypeInfo.typeName = type.typeName;
          type.properties.forEach((prop) => {
            const propertyTypeName = prop.typeName
              .replace(ExpressionChar("["), Empty(""))
              .replace(ExpressionChar("]"), Empty(""))
              .replace(ExpressionChar("!"), Empty(""));

            if (
              GraphQLUtils.isScalarType(propertyTypeName) &&
              propertyTypeName !== GQL_Root_Type("Query") &&
              propertyTypeName !== GQL_Root_Type("Mutation")
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

    this.writeAllMutationAndQueriesSeperatelyToTsFilesSync(
      graphQLToTs,
      singleOutFile,
      appName
    );

    return graphQLToTs;
  }

  //
  writeAllMutationAndQueriesSeperatelyToTsFilesSync(
    graphQLToTs: GraphQLToTS,
    singleOutFile: boolean,
    appName: string
  ) {
    //
    const OUTPUT_FOLDER =
      OUTPUT_QUERIES_AND_MUTATIN_TS_FOLDER_PATH(
        "./../base-react-native-app/graphql/CURRENT_APP/",
        appName
      ) + QUERIES_MUTATION_TS_FOLDER("querys.and.mutations");

    let SINGLE_OUTPUT_FILE = OUTPUT_FOLDER;
    if (singleOutFile) {
      SINGLE_OUTPUT_FILE = File.path(
        OUTPUT_FOLDER,
        SingleTypeMutationAndQueriesScriptOutFile(
          "/all.queries.and.mutations.ts"
        )
      );
    }

    const allTypes = graphQLToTs.allTypesCombined;

    const templateFilePath = QUERIES_MUTATION_TS_TEMPLATE_FILE_PATH(
      "./GraphQLAPI/queries.mutation.ts.templates/all.queries.templates.template.header.ts"
    );

    let resultFileDataArray: string[] = [];
    let bodyFileDataArray: string[] = [];

    //Header file imports ...
    let templateHeaderData = fs
      .readFileSync(templateFilePath, {
        encoding: "utf8",
        flag: "r",
      })
      .replace(Comment("//"), Empty(""));

    templateHeaderData.replace(Comment("//"), Empty("")) + NewLine("\n");

    //Non header file
    const templateFileData = fs.readFileSync(
      templateFilePath.replace(".header", Empty("")),
      {
        encoding: "utf8",
        flag: "r",
      }
    );

    allTypes?.forEach((type) => {
      if (
        type.typeName === GQL_Root_Type("Query") ||
        type.typeName === GQL_Root_Type("Mutation")
      ) {
        type.properties.forEach((prop) => {
          let propertyName = prop.propertyName;

          const indexOfFunctionStart = propertyName.indexOf("(");
          if (indexOfFunctionStart > -1) {
            propertyName = propertyName.substring(0, indexOfFunctionStart);
          }

          let outPutData = "";

          if (type.typeName === GQL_Root_Type("Mutation")) {
            let typeName = prop.typeName;
            console.log("Type@Name", typeName);

            //importUrls
            let importUrlOrUrls = this.getImportUrlFromType(allTypes, typeName);
            importUrlOrUrls.forEach((importUrl) => {
              templateHeaderData += NewLine("\n") + importUrl + NewLine("\n");
            });

            const isNullType = prop.isNull ? " | undefined" : "";

            typeName = prop.typeName + isNullType;

            if (prop.typeName) {
              outPutData = templateFileData.replace(
                MUTATION_PROPERTY_NAME('Query["@QUERY_PROPERTY_NAME"]'),
                typeName
              );
            }

            outPutData = outPutData.replace(
              QUERY_PROPERTY_NAME("@QUERY_PROPERTY_NAME"),
              propertyName
            );

            outPutData = outPutData.replace(
              GQL_Root_Type("Query"),
              GQL_Root_Type("Mutation")
            );

            outPutData = outPutData.replace(
              "base_query_type",
              "base_mutation_type"
            );
          } else if (type.typeName === GQL_Root_Type("Query")) {
            outPutData = templateFileData.replace(
              QUERY_PROPERTY_NAME("@QUERY_PROPERTY_NAME"),
              propertyName
            );
          }

          // if (type.typeName === GQL_Root_Type("Query")) {
          outPutData += ExportSyntax("export { TYPE_NAME } ", propertyName);
          outPutData = outPutData.replace(Comment("//"), Empty(""));
          // }

          bodyFileDataArray.push(outPutData);
        });
        return;
      }
    });

    resultFileDataArray.push(templateHeaderData);
    resultFileDataArray.push(...bodyFileDataArray);

    if (singleOutFile) {
      File.writeToFileSync(resultFileDataArray, SINGLE_OUTPUT_FILE);
    }

    console.log(bodyFileDataArray);
    console.clearAfter("resultFileDataArray mutation");
  }

  getType(allTypes: TypeInfo[], typeName: string) {
    typeName = GraphQLUtils.getTrimmedType(typeName);

    console.log("$$$$$$$", typeName);

    let type = allTypes.filter((type) => {
      if (type.typeName === typeName) {
        return true;
      } else {
        return false;
      }
    })[0];

    return type;
  }

  getImportUrlFromType(allTypes: TypeInfo[], typeName: string | undefined) {
    if (typeName) {
      if (!typeName.includes(",")) {
        //
        let type = this.getType(allTypes, typeName);
        return [
          NewLine("\n") +
            type.importUrl.replace("TYPE_NAME", type.typeName) +
            NewLine("\n"),
        ];
        //
      } else if (typeName.includes(",")) {
        let resultImportArray: string[] = [];
        let typeNames = typeName.split(",");

        typeNames.forEach((typName, index) => {
          typName = GraphQLUtils.getTrimmedType(typName);
          let type = this.getType(allTypes, typName);
          console.log("@@@@@@@", typeName);

          resultImportArray.push(
            NewLine("\n") +
              type.importUrl.replace("TYPE_NAME", type.typeName) +
              NewLine("\n")
          );
        });

        return resultImportArray;
      }
    }
    return ["//no import url, " + typeName];
  }

  generateQueryAndMutationToAppTS(filesDataTs: GraphQLToTS) {}

  attachDependentTypesToFile(
    allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[],
    allTypesCombined: TypeInfo[]
  ) {
    let resultImportUrl = "";

    if (allOtherDependentTypesFromPropertyTypesFromOtherFiles.length == 0) {
      resultImportUrl = NewLine("\r\n");
      return resultImportUrl;
    }

    allOtherDependentTypesFromPropertyTypesFromOtherFiles.forEach(
      (depType, index) => {
        const type = allTypesCombined.filter(
          (type) => type.typeName === depType
        )[0];

        if (index === 0) {
          resultImportUrl = NewLine("\r\n") + resultImportUrl;
        }

        resultImportUrl +=
          type.importUrl.replace("TYPE_NAME", depType) + NewLine("\r\n");
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
    let typeType: GQLFileType;
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

    if (fileName.indexOf(GQLFileType("querys.and.mutations")) > -1) {
      typeType = GQLFileType("querys.and.mutations");

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GQLFileType("input")) > -1) {
      typeType = GQLFileType("input");

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GQLFileType("type")) > -1) {
      typeType = GQLFileType("type");

      folderToCreate = fileName.substring(
        0,
        fileName.indexOf(Dot(".") + typeType)
      );
    } else if (fileName.indexOf(GQLFileType("mutation")) > -1) {
      typeType = GQLFileType("mutation");

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
      if ((typeType = GQLFileType("querys.and.mutations"))) {
        folderToCreate = typeType;
      }
    }

    if (
      folderToCreate ===
      FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations(
        "queries.mutation.ts.templates"
      )
    ) {
      folderToCreate =
        FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations(
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
            : Empty("");
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
    let outFilePath = OutPathReactNative_AppName(
      "./../base-react-native-app/graphql/CURRENT_APP/",
      graphQLToTs.appName
    );

    if (singleOutFile) {
      outFilePath += SingleTypeScriptOutFile("/types.ts");

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
          if (folderToCreate.trim() !== Empty("")) {
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
      //
      console.log("\n******* Write Data ********\n");
      //
      console.log(writeDataArrya);
    }
  }
}
