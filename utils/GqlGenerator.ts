import fs, { readdirSync } from "fs";
import { compareAndRemoveDuplicates, removeDuplicates } from "./all.util";

type TypeOfGraphQLFile =
  | "input"
  | "type"
  | "mutation"
  | ".querys.and.mutations";

type GraphQLToTS = {
  appName: string;
  fileAndData: FileAndData[];
};

type PropertyInfo = {
  propertyName: string;
  typeName: string;
};

type TypeInfo = {
  properties: PropertyInfo[];
  typeName: string;
};

type FileAndData = {
  fileName: string;
  type: TypeOfGraphQLFile;
  data: string;
  folderToCreate: string;
  allTypesInSingleFile: string[];
  allTypesInSingleFileCount: number;
  typesAndProperties: TypeInfo[];
  typesAndPropertiesCount: number;
  allOtherDependentTypesFromPropertiesFromOtherFiles: string[];
  importPath: string;
};

export default class GqlGenerator {
  generateGraphQLToTs(fileNames: string[], appName: string) {
    const fileNameAndData: FileAndData[] = [];

    fileNames.forEach((file) => {
      const filePathIndex = file.lastIndexOf("/");
      let fileName = file;

      let allOtherDependentTypesFromPropertiesFromOtherFiles: string[] = [];

      let allTypesInSingleFile: string[] = [];
      let typesAndProperties: TypeInfo[] = [];

      if (filePathIndex > -1) {
        fileName = file.substring(filePathIndex + 1);
      }

      let fileData = "";

      let fileDataArray = fs
        .readFileSync(file, { encoding: "utf8", flag: "r" })
        .split("\n");

      let typeAndProperty: TypeInfo = {
        properties: [],
        typeName: "",
      };

      let exportData = "";
      fileDataArray.forEach((data, index) => {
        // console.log(data, index);

        data = data.replace("schema", "type Schema ");
        // data = data.replace("input ", "type ");

        if (data.trim() !== "") {
          if (data.indexOf("type ") > -1) {
            typeAndProperty = {
              properties: [],
              typeName: "",
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
            typesAndProperties.push(typeAndProperty);
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

                allOtherDependentTypesFromPropertiesFromOtherFiles.push(
                  nonScalarType
                    .replace("[", "")
                    .replace("]", "")
                    .replace("!", "")
                );
                typeAndProperty.properties.push(propInfo);
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
      });

      let typeType: TypeOfGraphQLFile;
      let folderToCreate = "";
      if (!(fileName.lastIndexOf(".graphql") > -1))
        throw new Error(
          `incorect type of file : not a graphql file ${fileName}`
        );

      if (fileName.indexOf(".querys.and.mutations") > -1) {
        typeType = ".querys.and.mutations";

        folderToCreate = fileName.substring(
          0,
          fileName.indexOf("." + typeType)
        );
      } else if (fileName.indexOf("input") > -1) {
        typeType = "input";

        folderToCreate = fileName.substring(
          0,
          fileName.indexOf("." + typeType)
        );
      } else if (fileName.indexOf("type") > -1) {
        typeType = "type";

        folderToCreate = fileName.substring(
          0,
          fileName.indexOf("." + typeType)
        );
      } else if (fileName.indexOf("mutation") > -1) {
        typeType = "mutation";

        folderToCreate = fileName.substring(
          0,
          fileName.indexOf("." + typeType)
        );
      } else {
        throw new Error("incorect type of file : not a graphql file : phase 2");
      }

      // let typeNameToCreate = "";

      // fileName.split(".").forEach((data) => {
      //   if (data.toLowerCase() !== "graphql")
      //     typeNameToCreate += data.charAt(0).toUpperCase() + data.substring(1);
      // });

      allOtherDependentTypesFromPropertiesFromOtherFiles =
        compareAndRemoveDuplicates(
          allOtherDependentTypesFromPropertiesFromOtherFiles,
          allTypesInSingleFile
        );

      // allOtherNonScalarFromPropertyTypes =
      //   allOtherNonScalarFromPropertyTypes.filter(function (val) {
      //     return allTypesInSingleFile.indexOf(val) == -1;
      //   });

      allOtherDependentTypesFromPropertiesFromOtherFiles = removeDuplicates(
        allOtherDependentTypesFromPropertiesFromOtherFiles
      );

      fileName = fileName.substring(0, fileName.lastIndexOf("."));

      console.log("allTypesInSingleFile", allTypesInSingleFile);
      const fileAndData: FileAndData = {
        fileName: fileName + ".ts",
        type: typeType,
        data: fileData,
        folderToCreate: folderToCreate,
        allTypesInSingleFile: allTypesInSingleFile,
        allTypesInSingleFileCount: allTypesInSingleFile.length,
        typesAndProperties: typesAndProperties,
        typesAndPropertiesCount: typesAndProperties.length,
        importPath:
          'import { TYPE_NAME } from "../' +
          (folderToCreate.trim() !== "" ? folderToCreate + "/" : "") +
          fileName +
          '"',
        allOtherDependentTypesFromPropertiesFromOtherFiles:
          allOtherDependentTypesFromPropertiesFromOtherFiles,
      };

      console.log(
        "allOtherNonScalarFromPropertyTypes",
        allOtherDependentTypesFromPropertiesFromOtherFiles
      );

      fileNameAndData.push(fileAndData);
    });

    const graphQLToTs: GraphQLToTS = {
      appName: appName,
      fileAndData: fileNameAndData,
    };

    console.log("graphql to ts file generator", graphQLToTs);

    const outputPath =
      "./../base-react-native-app/" +
      "App/" +
      appName +
      "/graphql/graphql.types/";

    let fileAndData = graphQLToTs.fileAndData;
    for (let i = 0; i < graphQLToTs.fileAndData.length; i++) {
      let tsData = fileAndData[i];

      if (tsData.allTypesInSingleFile.length > 0) {
        tsData.allTypesInSingleFile.forEach((inFileTypes) => {
          //
        });
      }
    }

    return graphQLToTs;
  }

  writeGeneratedGraphQLToTsFilesSync(
    graphQLToTs: GraphQLToTS,
    singleOutFile: boolean,
    outPath: string
  ) {
    if (singleOutFile) {
      outPath += "/types.ts";
    }
    outPath = outPath.replace("{CURRENT_APP}", graphQLToTs.appName);
  }
}
