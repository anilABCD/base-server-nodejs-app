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

      const fileNames = fileObj.getDirectoryOrFileNames(
        ["./GraphQLAPI/" + getEnv(EnvEnumType.CURRENT_APP)?.replace("-", ".")],
        fileParams
      );

      // console.log("FileNames :", fileNames);

      const filesData = fileObj.getFilesData(fileNames);

      console.log(filesData);

      const resultAfterWrite = fileObj.writeToFile(
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
