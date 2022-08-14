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

      console.log(
        "getFilesData_GraphQLtoTsFileTypesSync To generate :",
        fileNames
      );
      const filesDataTs = fileObj.getFilesData_GraphQLtoTsFileTypesSync(
        fileNames,
        CURRENT_APP
      );

      console.log(filesData);

      const resultAfterWrite = fileObj.writeToFileSync(
        filesData,
        "./GraphQLAPI/" +
          getEnv(EnvEnumType.CURRENT_APP)?.replace("-", ".") +
          "/schema.graphql"
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
