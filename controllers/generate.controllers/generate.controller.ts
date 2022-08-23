import catchAsync from "../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import File, { FileParams } from "../../utils/File";
import EnvEnumType from "../../enums/EnvEnumType";
import getEnv from "../../env/getEnv";

import console from "../../utils/console";
import GqlGenerator from "../../utils/GqlGenerator";
import RegexExtract from "../../utils/RegexExtract";
import {
  CURRENT_APP,
  GLQ_Files_Excluded,
  GQL_SERVER_OUTPUT_PATH_COMBINED_FILE,
  OutPathReactNative_AppName,
} from "../../utils/graphql_types";
import { compareAndRemoveDuplicates } from "../../utils/all.util";

export default class GenerateController {
  CURRENT_APP: string;

  constructor(CURRENT_APP_: string) {
    this.CURRENT_APP = CURRENT_APP_;

    if (this.CURRENT_APP === "") {
      throw new Error("CURRENT_APP : is not provided in Generate GraphQL");
    }
  }

  generate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.query.CURRENT_APP) {
        this.CURRENT_APP = req.query.CURRENT_APP.toString();
      }

      const singleOutFile = req.query.singleOut;

      const fileParams: FileParams = {
        namesOf: "file",
      };

      let fileNames = File.getDirectoryOrFileNamesSync(
        ["./GraphQLAPI/" + this.CURRENT_APP],
        fileParams,
        ["graphql", "ts"]
      );

      // console.clearAfter("getFilesDataSync");

      console.log("All File Names : ", fileNames);

      let gqlGenerator = new GqlGenerator();

      const data_combinedFromAllGraphqlFiles =
        gqlGenerator.generateAllCombinedGrqphQLSchema(
          fileNames,
          this.CURRENT_APP
        );

      console.log(
        " /schema.graphql : All Combined Generated Data : ",
        data_combinedFromAllGraphqlFiles
      );

      const isSingleOutFile = singleOutFile === "true" ? true : false;

      const obj_generatedFromGraphqlFiles_To_TS =
        gqlGenerator.generateGraphQLToTs(
          fileNames,
          this.CURRENT_APP,
          isSingleOutFile
        );

      let dataOfTsFiles = "";
      obj_generatedFromGraphqlFiles_To_TS.fileAndDataWithTypesInfo.forEach(
        (value) => {
          dataOfTsFiles += value.convertedTsDataString;
        }
      );

      let headerInfo = fileAuthorAndHeaderInformation.replace(
        CURRENT_APP("CURRENT_APP"),
        this.CURRENT_APP
      );

      dataOfTsFiles = headerInfo + dataOfTsFiles;

      // const resultAfterWriteTs = File.writeToFileSync(
      //   [dataOfTsFiles],
      //   "./../base-react-native-app/" +
      //     "graphql/" +
      //     this.CURRENT_APP +
      //     "/types.ts"
      // );

      // "./../base-react-native-app/" +
      // "App/" +
      // "{CURRENT_APP}" +
      // "/graphql/graphql.types/"

      const typeNames =
        obj_generatedFromGraphqlFiles_To_TS.allTypesCombined?.map((types) => {
          return types.typeName;
        });

      // console.error("trace");
      let result = {
        typeNames,
        fileNames: obj_generatedFromGraphqlFiles_To_TS.fileNames,
        appName: obj_generatedFromGraphqlFiles_To_TS.appName,
        isSingleOutFile,
      };

      res.status(200).json({
        status: "success",
        data: {
          generated: result,
        },
      });
    }
  );

  writeToCurrentApplication() {}
}

const fileAuthorAndHeaderInformation = `
//
// @Author : Anil Kumar Potlapally 
//
// @Email : 786.anil.potlapally@gmail.com
//
// @Generated For : @App_Name : @CURRENT_APP
// 
// @Code_Generated_Project_Name : /base-server-nodejs-app :
//
// @Code_Generated_Controller : ./base-server-nodejs-app/controllers/generate.controllers/generate.controller.ts
//
// @Code_Generated_API_End_Point : http://localhost:${getEnv(
  EnvEnumType.PORT
)}/api/v1/generate/
//
\r\n\r\n`;
