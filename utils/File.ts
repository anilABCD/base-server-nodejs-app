import { dir } from "console";
import fs, { readdirSync } from "fs";

import path, { dirname } from "path";
import { compareAndRemoveDuplicates } from "./all.util";
import console from "./console";
import { GLQ_Files_Excluded } from "./graphql_types";

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

  static getDirectoryOrFileNamesSync(
    directoryNames: string[],
    params: FileParams,
    extensions: string[]
  ) {
    const fileObje = new File();

    let resultNames = fileObje.getDirectoryNamesSync(directoryNames);
    // console.log("resultNames :", resultNames);
    if (params.namesOf === "file") {
      //
      directoryNames.forEach((dirName) => {
        resultNames.push(dirName);
      });

      resultNames = fileObje.getFileNamesSync(resultNames, extensions);
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
  private getFileNamesSync(directoryName: string[], extensions: string[]) {
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
            if (dir.name.substring(dir.name.lastIndexOf(".") + 1) === ext) {
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

  static getExtension(path: string) {
    return path.substring(path.lastIndexOf(".") + 1);
  }

  static getFileName(path: string) {
    return path.substring(path.lastIndexOf("/") + 1);
  }

  static getFilesDataSync(
    fileNames: string[],
    extensions: string[],
    excludeFileNames: string[]
  ) {
    let filesData: string[] = [];

    fileNames.forEach((fileName) => {
      if (
        extensions.includes(File.getExtension(fileName)) ||
        extensions.includes("*")
      ) {
        if (!excludeFileNames.includes(File.getFileName(fileName))) {
          console.log("not excluded filename", fileName);

          filesData.push(
            fs.readFileSync(fileName, { encoding: "utf8", flag: "r" }) +
              "\r\n\r\n"
          );
        } else {
          console.log("@excluded filename", fileName);
        }
      }
    });
    // console.clearAfter("not excluded filename");
    return filesData;
  }

  static writeToFileSync(filesData: string[], outFilePath: string) {
    const data = filesData.join("");

    console.log("GQL Out File Path", outFilePath);

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

  static createDirectorySync(directory: string, isRecursive?: boolean) {
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
