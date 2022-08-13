import { dir } from "console";
import fs, { readdirSync } from "fs";

import path, { dirname } from "path";

// const directoryPath = path.join("__dirname", 'Documents');
// //passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     }
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         console.log(file);
//     });
// });

type FileParams = {
  namesOf: "file" | "directories";
};

type TypeOfGraphQLFile = "input" | "type" | "mutation";

type FileAndData = {
  fileName: string;
  type: TypeOfGraphQLFile;
  data: string;
  typeNameToCreate: string;
};

export { FileParams };

class File {
  getDirectoryOrFileNamesSync(directoryName: string[], params: FileParams) {
    let resultNames = this.getDirectoryNamesSync(directoryName);
    // console.log("directory names :", resultNames);
    if (params.namesOf === "file") {
      resultNames.push(directoryName[0]);
      resultNames = this.getFileNamesSync(resultNames, ["graphql"]);
      // console.log("file names :", resultNames);
    }

    return resultNames;
  }

  private getDirectoryNamesSync(
    directoryName: string[],
    result: string[] = []
  ) {
    // console.log(directoryName);

    directoryName.forEach((dirName) => {
      if (dirName.indexOf("..") > -1) {
        return;
      }

      // console.log(dirName);
      const directoryNameResult = readdirSync(dirName, { withFileTypes: true })
        .filter(
          (dir) =>
            dir.isDirectory() &&
            dir.name !== ".git" &&
            dir.name !== ".npm-i-modified" &&
            dir.name != "node_modules" &&
            dir.name !== "dist"
        )
        .map((dirname) => dirName + "/" + dirname.name);

      // console.log(directoryNameResult);

      // console.log(directoryName);

      if (directoryNameResult.length > 0) {
        result.push(...directoryNameResult);
        this.getDirectoryNamesSync(directoryNameResult, result);
        // console.log(result);
      }
    });

    return result;

    // path.join("__dirname", "Documents");
    //
    // dirNames.forEach( function (directory) {
    //     const files = readdirSync(directory);
    //     files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         console.log(file);
    //       });
    // } )
  }

  //
  //
  private getFileNamesSync(
    directoryName: string[],
    extensions: string[] = [],
    excludeFileNames = "schema.graphql"
  ) {
    let result: string[] = [];
    console.log("getFileNames", directoryName);

    directoryName.forEach((dirName) => {
      if (dirName.indexOf("..") > -1) {
        return;
      }

      // console.log(dirName);
      const fileNameResult = readdirSync(dirName, { withFileTypes: true })
        .filter((dir) => {
          let isExtensionPassed = false;

          extensions.forEach((ext) => {
            const currentFileExt = dir.name.substring(
              dir.name.lastIndexOf(".")
            );
            if (
              dir.name.substring(dir.name.lastIndexOf(".") + 1) === ext &&
              !(dir.name.lastIndexOf(excludeFileNames) > -1)
            ) {
              isExtensionPassed = true;
            }
          });

          return isExtensionPassed && dir.isFile();
        })
        .map((dirname) => dirName + "/" + dirname.name);

      result.push(...fileNameResult);
    });

    result = result.sort();

    // console.log(result);

    return result;

    //
    // path.join("__dirname", "Documents");
    //
    // dirNames.forEach( function (directory) {
    //     const files = readdirSync(directory);
    //     files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         console.log(file);
    //       });
    // } )
    //
  }

  getFilesDataSync(fileNames: string[]) {
    let filesData: string[] = [];

    fileNames.forEach((file) => {
      filesData.push(
        fs.readFileSync(file, { encoding: "utf8", flag: "r" }) + "\r\n\r\n"
      );
    });

    return filesData;
  }

  getFilesData_GraphQLtoTsFileTypesSync(fileNames: string[]) {
    const fileNameAndData: FileAndData[] = [];

    fileNames.forEach((file) => {
      const filePathIndex = file.lastIndexOf("/");
      let fileName = file;

      if (filePathIndex > -1) {
        fileName = file.substring(filePathIndex + 1);
      }

      let fileData = "";

      let fileDataArray = fs
        .readFileSync(file, { encoding: "utf8", flag: "r" })
        .split("\n");

      fileDataArray.forEach((data, index) => {
        console.log(data, index);

        data = data.replace("schema ", "type Schema ");
        data = data.replace("input ", "type ");

        if (data.indexOf("type ") > -1) {
          const typeData = data.split(" ");
          const typeName = typeData[1];
          if (typeName !== "{") {
            data = `\r\n export { ${typeName} }` + `\r\n` + data;
          }
        }
        // Int, Float, String, Boolean, and ID, Date

        if (data.indexOf("input ") > -1) {
          const typeData = data.split(" ");
          const typeName = typeData[1];
          data = data.replace("input ", "type ");
          data = `\r\n export { ${typeName} }` + `\r\n\r\n` + data;
        }

        if (data.indexOf("schema ") > -1) {
          const typeData = data.split(" ");
          const typeName = typeData[1];
          data = data.replace("schema ", "type ");
          data = `\r\n export { ${typeName} }` + `\r\n\r\n` + data;
        }

        if (!(data.indexOf("}") > -1)) {
          if (data.indexOf("{") > -1) {
            data = data.replace("{", "= {");
          }

          if (data.indexOf(" Query") > -1) {
            data = data.replace(/Query./, "any");
          }

          if (data.indexOf(" Mutation") > -1) {
            data = data.replace(/Mutation./, "any");
          }

          if (data.indexOf(" ID") > -1) {
            data = data.replace(/ID./, "string");
          }

          if (data.indexOf(" String") > -1) {
            data = data.replace(/String./, "string");
          }

          if (data.indexOf(" Float") > -1) {
            data = data.replace(/Float./, "number");
          }

          if (data.indexOf(" Boolean") > -1) {
            data = data.replace(/Boolean./, "boolean");
          }

          if (data.indexOf(" Int") > -1) {
            data = data.replace(/Int./, "number");
          }

          if (!(data.indexOf("{") > -1)) {
            data += ";";
          }
        }

        fileData += data;
      });

      let typeType: TypeOfGraphQLFile;
      let typeName = "";
      if (!(fileName.lastIndexOf(".graphql") > -1))
        throw new Error(
          `incorect type of file : not a graphql file ${fileName}`
        );

      if (fileName.indexOf("input") > -1) {
        typeType = "input";

        typeName = fileName.substring(0, fileName.indexOf("." + typeType));
      } else if (fileName.indexOf("type") > -1) {
        typeType = "type";

        typeName = fileName.substring(0, fileName.indexOf("." + typeType));
      } else if (fileName.indexOf("mutation") > -1) {
        typeType = "mutation";

        typeName = fileName.substring(0, fileName.indexOf("." + typeType));
      } else {
        throw new Error("incorect type of file : not a graphql file : phase 2");
      }

      let typeNameToCreate = "";

      fileName.split(".").forEach((data) => {
        if (data.toLowerCase() !== "graphql")
          typeNameToCreate += data.charAt(0).toUpperCase() + data.substring(1);
      });

      fileName = fileName.substring(0, fileName.lastIndexOf(".")) + ".ts";

      const fileAndData: FileAndData = {
        fileName: fileName,
        type: typeType,
        data: fileData,
        typeNameToCreate: typeNameToCreate,
      };

      fileNameAndData.push(fileAndData);
    });

    console.log("graphql to ts file generator", fileNameAndData);

    return fileNameAndData;
  }

  writeToFileSync(filesData: string[], outFilePath: string) {
    const data = filesData.join("");

    // if (outFilePath.lastIndexOf(".graphql") > -1) {
    //   fs.unlinkSync(outFilePath);
    // }

    // console.log("written", data);

    const result = fs.writeFileSync(outFilePath, data, { flag: "w" });

    return result;
  }

  //////////////////////////////////////////////
  // fs.readFile('./input1.txt',
  //         {encoding:'utf8', flag:'r'},
  //         function(err, data) {
  //     if(err)
  //         console.log(err);
  //     else
  //         console.log(data);
  // });
  /////////////////////////////////////////////
  //
}

//
// Example :
//
// const fileObj = new File();
//
// We can send multiple directories :
//
// const directories: string[] = [".", "."];
// console.log(fileObj.readDirectorySync(directories), "result Directories");
//

export default File;
