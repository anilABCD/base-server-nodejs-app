import catchAsync from "../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import File, { FileParams } from "../../utils/File";
import EnvEnumType from "../../enums/EnvEnumType";
import getEnv from "../../env/getEnv";

import console from "../../utils/console";
import GqlGenerator from "../../utils/GqlGenerator";

export default class GenerateController {
  CURRENT_APP: string;

  constructor(CURRENT_APP: string) {
    this.CURRENT_APP = CURRENT_APP;

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

      const fileNames = File.getDirectoryOrFileNamesSync(
        [
          "./GraphQLAPI/" + this.CURRENT_APP,
          "./GraphQLAPI/queries.mutation.ts.templates",
        ],
        fileParams
      );

      console.log("getFilesDataSync To generate:", fileNames);

      const filesData = File.getFilesDataSync(fileNames);

      console.log("GenerateGraphQLToTs To generate :", fileNames);

      let gqlGenerator = new GqlGenerator();

      const isSingleOutFile = singleOutFile === "true" ? true : false;

      const filesDataTs = gqlGenerator.generateGraphQLToTs(
        fileNames,
        this.CURRENT_APP,
        isSingleOutFile
      );

      console.log(filesData);

      const resultAfterWrite = File.writeToFileSync(
        filesData,
        "./GraphQLAPI/" + this.CURRENT_APP + "/schema.graphql"
      );

      let dataOfTsFiles = "";
      filesDataTs.fileAndDataWithTypesInfo.forEach((value) => {
        dataOfTsFiles += value.convertedTsDataString;
      });

      let headerInfo = fileAuthorAndHeaderInformation.replace(
        "CURRENT_APP",
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

      console.log("File Written", resultAfterWrite);

      const typeNames = filesDataTs.allTypesCombined?.map((types) => {
        return types.typeName;
      });

      // console.error("trace");
      let result = {
        typeNames,
        fileNames: filesDataTs.fileNames,
        appName: filesDataTs.appName,
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
