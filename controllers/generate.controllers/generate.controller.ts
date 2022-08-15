import catchAsync from "../../ErrorHandling/catchAsync";

import { Request, Response, NextFunction } from "express";
import File, { FileParams } from "../../utils/File";
import EnvEnumType from "../../enums/EnvEnumType";
import getEnv from "../../env/getEnv";

import console from "../../utils/console";

export default class GenerateController {
  constructor() {}

  generate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let result = true;

      let outPath = req.query.path;

      const fileObj = new File();

      const fileParams: FileParams = {
        namesOf: "file",
      };

      const CURRENT_APP = getEnv(EnvEnumType.CURRENT_APP)?.replace("-", ".");

      if (CURRENT_APP === undefined || CURRENT_APP === "") {
        throw new Error("CURRENT_APP IS NOT SPECIFIED");
      }

      const fileNames = fileObj.getDirectoryOrFileNamesSync(
        ["./GraphQLAPI/" + CURRENT_APP],
        fileParams
      );

      console.log("getFilesDataSync To generate:", fileNames);

      const filesData = fileObj.getFilesDataSync(fileNames);

      console.log("GenerateGraphQLToTs To generate :", fileNames);
      const filesDataTs = fileObj.generateGraphQLToTs(fileNames, CURRENT_APP);

      console.log(filesData);

      const resultAfterWrite = fileObj.writeToFileSync(
        filesData,
        "./GraphQLAPI/" + CURRENT_APP + "/schema.graphql"
      );

      let dataOfTsFiles = "";
      filesDataTs.fileAndData.forEach((value) => {
        dataOfTsFiles += value.data;
      });

      dataOfTsFiles =
        `
//
// @Athor : Anil Kumar Potlapally 
// @Email : 786.anil.potlapally@gmail.com
//
// @Generated For : @App_Name : @${CURRENT_APP}
// 
// @Code_Generated_Project_Name : /base-server-nodejs-app :
//
// @Code_Generated_Controller : ./base-server-nodejs-app/controllers/generate.controllers/generate.controller.ts
//
// @Code_Generated_API_End_Point : http://localhost:${getEnv(
          EnvEnumType.PORT
        )}/api/v1/generate/
//
\r\n\r\n` + dataOfTsFiles;

      const resultAfterWriteTs = fileObj.writeToFileSync(
        [dataOfTsFiles],
        "./../base-react-native-app/" +
          "App/" +
          CURRENT_APP +
          "/graphql/graphql.types/" +
          "/types.ts"
      );

      console.log("File Written", resultAfterWrite);

      // console.error("trace");

      res.status(200).json({
        status: "success",
        data: {
          generated: result,
        },
      });
    }
  );
}
