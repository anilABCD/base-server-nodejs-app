import fs, { readdirSync, write } from "fs";
import { compareAndRemoveDuplicates, removeDuplicates } from "./all.util";
import GraphQLUtils from "./GraphQLUtils";

import File from "./File";

type TypeOfGraphQLFile =
  | "input"
  | "type"
  | "mutation"
  | ".querys.and.mutations";

type GraphQLToTS = {
  appName: string;
  fileAndDataWithTypesInfo: FileAndTypesDataInfo[];
  allTypesCombined?: TypeInfo[];
};

type PropertyInfo = {
  propertyName: string;
  typeName: string;
  propertyType?: TypeInfo;
  propertyTypeAttachedTypeName?: string;
};

type TypeInfo = {
  properties: PropertyInfo[];
  typeName: string;
  isPureType?: boolean;
  dependentTypes?: string[];
  folderToCreate: string;
  importUrl: string;
  fileName: string;
};

type FileAndTypesDataInfo = {
  fileName: string;
  type: TypeOfGraphQLFile;
  convertedTsDataString: string;
  folderToCreate: string;
  allTypesInSingleFile: string[];
  allTypesInSingleFileCount: number;
  typesAndProperties: TypeInfo[];
  typesAndPropertiesCount: number;
  allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[];
  importUrl: string;
};

export default class GqlGenerator {
  generateGraphQLToTs(fileNames: string[], appName: string) {
    const fileNameAndDataWithTypes: FileAndTypesDataInfo[] = [];
    let allTypesCombined: TypeInfo[] = [];
    fileNames.forEach((file) => {
      //#region File Array Scope

      const filePathIndex = file.lastIndexOf("/");
      let fileNameTemp = file;

      let allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[] = [];

      let allTypesInSingleFile: string[] = [];
      let typesAndProperties: TypeInfo[] = [];

      if (filePathIndex > -1) {
        fileNameTemp = file.substring(filePathIndex + 1);
      }

      const { typeType, folderToCreate, fileName } =
        this.getFolderName(fileNameTemp);

      const importUrl = this.getImportUrl(folderToCreate, fileName);

      let fileData = "";

      const fileDataArray = fs
        .readFileSync(file, { encoding: "utf8", flag: "r" })
        .split("\n");

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
            if (typeName !== "{") {
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

          if (data.indexOf("}") > -1) {
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

          if (!(data.indexOf("}") > -1)) {
            if (data.indexOf("{") > -1) {
              data = data.replace("{", "= { \r\n");
              // if (isType === true) {
              // }
            }

            const lastIndexOfCollon = data.lastIndexOf(":");

            if (
              !(
                data.indexOf(" ID") > -1 ||
                data.indexOf(" String") > -1 ||
                data.indexOf(" Float") > -1 ||
                data.indexOf(" Boolean") > -1 ||
                data.indexOf(" Int") > -1
              )
            ) {
              if (data.indexOf(":") > -1) {
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
                    .replace("[", "")
                    .replace("]", "")
                    .replace("!", "")
                );
                typeAndProperty.properties.push(propInfo);
              }

              if (data.indexOf("(") > -1) {
                if (typeType === ".querys.and.mutations") {
                  //
                  const indexOfOpenBrace = data.indexOf("(");
                  const indexOfCloseBrace = data.indexOf(")");

                  const params = data.substring(
                    indexOfOpenBrace + 1,
                    indexOfCloseBrace
                  );

                  const paramsArray = params.split(",");

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

            // if (data.indexOf(" Query") > -1) {
            //   data = data.replace(/Query./, "any");
            // }

            // if (data.indexOf(" Mutation") > -1) {
            //   data = data.replace(/Mutation./, "any");
            // }

            if (data.indexOf(" ID") > -1) {
              data = data.replace(" ID", " string");
              let propInfo: PropertyInfo = {
                propertyName: data.substring(0, lastIndexOfCollon).trim(),
                typeName: data.substring(lastIndexOfCollon + 1).trim(),
              };

              typeAndProperty.properties.push(propInfo);
            }

            if (data.indexOf(" String") > -1) {
              data = data.replace(" String", " string");
              let propInfo: PropertyInfo = {
                propertyName: data.substring(0, lastIndexOfCollon).trim(),
                typeName: data.substring(lastIndexOfCollon + 1).trim(),
              };

              typeAndProperty.properties.push(propInfo);
            }

            if (data.indexOf(" Float") > -1) {
              data = data.replace(" Float", " number");
              let propInfo: PropertyInfo = {
                propertyName: data.substring(0, lastIndexOfCollon).trim(),
                typeName: data.substring(lastIndexOfCollon + 1).trim(),
              };

              typeAndProperty.properties.push(propInfo);
            }

            if (data.indexOf(" Boolean") > -1) {
              data = data.replace(" Boolean", " boolean");
              let propInfo: PropertyInfo = {
                propertyName: data.substring(0, lastIndexOfCollon).trim(),
                typeName: data.substring(lastIndexOfCollon + 1).trim(),
              };

              typeAndProperty.properties.push(propInfo);
            }

            if (data.indexOf(" Int") > -1) {
              data = data.replace(" Int", " number");
              let propInfo: PropertyInfo = {
                propertyName: data.substring(0, lastIndexOfCollon).trim(),
                typeName: data.substring(lastIndexOfCollon + 1).trim(),
              };

              typeAndProperty.properties.push(propInfo);
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

      allOtherDependentTypesFromPropertyTypesFromOtherFiles = removeDuplicates(
        allOtherDependentTypesFromPropertyTypesFromOtherFiles
      );

      console.log("allTypesInSingleFile", allTypesInSingleFile);

      allTypesCombined.push(...typesAndProperties);

      const fileAndData: FileAndTypesDataInfo = {
        fileName: fileName + ".ts",
        type: typeType,
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

    fileNameAndDataWithTypes.forEach((fileAndData) => {
      const dependentImportTypesUrls = this.attachDependentTypesToFile(
        fileAndData.allOtherDependentTypesFromPropertyTypesFromOtherFiles,
        allTypesCombined
      );

      const finalFileDataAsStringWithImportUrls =
        dependentImportTypesUrls + fileAndData.convertedTsDataString;

      fileAndData.convertedTsDataString = finalFileDataAsStringWithImportUrls;
    });

    const graphQLToTs: GraphQLToTS = {
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
            const propertyType = prop.typeName
              .replace("[", "")
              .replace("]", "")
              .replace("!", "");

            if (
              GraphQLUtils.isScalarType(propertyType) &&
              propertyType !== "Query" &&
              propertyType !== "Mutation"
            ) {
            }

            if (
              !GraphQLUtils.isScalarType(propertyType) &&
              propertyType !== "Query" &&
              propertyType !== "Mutation"
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

    this.writeGeneratedGraphQLToTsFilesSync(graphQLToTs, false);

    return graphQLToTs;
  }
  attachDependentTypesToFile(
    allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[],
    allTypesCombined: TypeInfo[]
  ) {
    let resultImportUrl = "";

    if (allOtherDependentTypesFromPropertyTypesFromOtherFiles.length == 0) {
      resultImportUrl = "\n";
      return resultImportUrl;
    }

    allOtherDependentTypesFromPropertyTypesFromOtherFiles.forEach(
      (depType, index) => {
        const type = allTypesCombined.filter(
          (type) => type.typeName === depType
        )[0];

        if (index === 0) {
          resultImportUrl = "\n" + resultImportUrl;
        }

        resultImportUrl += type.importUrl.replace("TYPE_NAME", depType) + "\n";
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

  // getFolderName
  getFolderName(fileName: string) {
    let typeType: TypeOfGraphQLFile;
    let folderToCreate = "";
    if (!(fileName.lastIndexOf(".graphql") > -1))
      throw new Error(`incorect type of file : not a graphql file ${fileName}`);

    if (fileName.indexOf(".querys.and.mutations") > -1) {
      typeType = ".querys.and.mutations";

      folderToCreate = fileName.substring(0, fileName.indexOf("." + typeType));
    } else if (fileName.indexOf("input") > -1) {
      typeType = "input";

      folderToCreate = fileName.substring(0, fileName.indexOf("." + typeType));
    } else if (fileName.indexOf("type") > -1) {
      typeType = "type";

      folderToCreate = fileName.substring(0, fileName.indexOf("." + typeType));
    } else if (fileName.indexOf("mutation") > -1) {
      typeType = "mutation";

      folderToCreate = fileName.substring(0, fileName.indexOf("." + typeType));
    } else {
      throw new Error("incorect type of file : not a graphql file : phase 2");
    }

    fileName = fileName.substring(0, fileName.lastIndexOf("."));
    folderToCreate = folderToCreate.toLowerCase();

    if (folderToCreate === "") {
      if ((typeType = ".querys.and.mutations")) {
        folderToCreate = typeType;
      }
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
    let outFilePath = "./../base-react-native-app/graphql/CURRENT_APP/";
    outFilePath = outFilePath.replace("CURRENT_APP", graphQLToTs.appName);

    if (singleOutFile) {
      outFilePath += "/types.ts";
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
        // writeData = {};

        const filePathToCreate = File.path(
          outFilePath,
          file.folderToCreate,
          file.fileName
        );

        // writeData.filePath = filePathToCreate + "/" + file.fileName;

        // writeData.fileData = file.finalFileDataAsStringWithImportUrls;

        File.writeToFileSync([file.convertedTsDataString], filePathToCreate);

        // writeDataArrya.push(writeData);
      });
      console.log("\n******* Write Data ********\n");
      console.log(writeDataArrya);
    }
  }
}
