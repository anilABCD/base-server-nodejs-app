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
  getNames(directoryName: string[], params: FileParams = { namesOf: "file" }) {
    let resultNames = this.getDirectoryNames(directoryName);
    console.log(resultNames);
    if (params.namesOf === "file") {
      resultNames.push(directoryName[0]);
      resultNames = this.getFileNames(resultNames);
      // console.log(resultNames);
    }

    return resultNames;
  }

  getDirectoryNames(directoryName: string[], result: string[] = []) {
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
        this.getDirectoryNames(directoryNameResult, result);
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
  getFileNames(
    directoryName: string[],
    result: string[] = [],
    extensions: string[] = []
  ) {
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

    console.log(result);

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

  getFilesData(fileNames: string[]) {
    let filesData: string[] = [];

    fileNames.forEach((file) => {
      filesData.push(fs.readFileSync(file, { encoding: "utf8", flag: "r" }));
    });

    return filesData;
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
