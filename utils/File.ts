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

export { FileParams };

class File {
  static path(...paths: string[]) {
    let extendingPath = "";
    if (paths) {
      paths.forEach((path, index) => {
        // Raising An Error ...
        path = path.replace(/\/+/g, "/");

        let text = path;

        //****************************************
        //
        // If has multiple // slashes ... more than two
        //
        // let pattern = /\/\/+/g;
        // let hasDoubleSlashes = pattern.test(text);

        // if (hasDoubleSlashes === true) {
        //   throw new Error(
        //     `\n ${path} \n// FolderToCreate : somthing wrong with path :
        //     (eg: .//somefolder///somefolder////....////somefolder)
        //     some thing wrong with folder path
        //     `
        //   );
        // }
        //
        //****************************************

        // if has multiple ... dots more than two .
        let doubleDotsPattern = /\.\.\.+/g;
        let hasDoubleDots = doubleDotsPattern.test(text);

        if (hasDoubleDots === true) {
          throw new Error(
            `\n ${path} \n// FolderToCreate : somthing wrong with path : 
            (eg: ..../somefolder/somefolder/..../somefolder) 
            some thing wrong with folder path
            `
          );
        }

        if (path.length > 0) {
          const divChar = path[0];

          if (divChar !== "/" && divChar !== ".") {
            path = "/" + path;
          }

          if (divChar !== "/" && index > 0) {
            path = "/" + path;
          }

          const lastIndexOfDiv = path.lastIndexOf("/");
          if (lastIndexOfDiv === path.length - 1) {
            {
              path = path.substring(0, lastIndexOfDiv);
            }
          }

          extendingPath += path;
        }
      });
    }

    const path = extendingPath.replace(/\/+/g, "/");

    return path;
  }

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

  createDirectorySync(directory: string, isRecursive?: boolean) {
    var dir = directory;

    if (!fs.existsSync(dir)) {
      if (isRecursive === true) {
        fs.mkdirSync(dir, { recursive: true });
      } else {
        fs.mkdirSync(dir);
      }
    }
  }
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
