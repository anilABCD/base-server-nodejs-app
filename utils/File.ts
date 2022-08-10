import fs, { readdirSync } from "fs";

import path from "path";

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

class File {
  readDirectorySync(directoryName: string[], result: string[] = []) {
    // console.log(directoryName);

    directoryName.forEach((dirName) => {
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
        this.readDirectorySync(directoryNameResult, result);
        // console.log(result);
      }
    });

    return result;

    // path.join("__dirname", "Documents");

    // dirNames.forEach( function (directory) {
    //     const files = readdirSync(directory);
    //     files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         console.log(file);
    //       });
    // } )
  }
}

export default File;
