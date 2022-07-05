import fs, { readdirSync } from "fs";
import path from "path";
import util from "util";
import EmailTemplatesEnumType from "../enums/EmailTemplatesEnumType";

const templateFilesRequiredForEmail = path.join(__dirname, "../views/email/");

export default function verifyEmailTemplates(): boolean {
  let files = readdirSync(templateFilesRequiredForEmail);

  // WARN : Object.keys( EmailTemplatesEnumType ) will get : keys and also their indexes .
  // WARN : For 1 keys we get 2 keys including their index
  // WARN : enum someEnum { PORT } when we use Object.keys(someEnum) we get result : { "0" , "PORT" }
  // WARN : for 2 keys we get 4 with their index for 3 we get 6 with their indexes .
  const verifiedFilesDataWithoutIndexes = Object.keys(
    EmailTemplatesEnumType
  ).filter((fileName) => {
    if (isNaN(parseInt(fileName))) {
      return true;
    }
    return false;
  });

  const verifiedFiles = verifiedFilesDataWithoutIndexes.map(
    (fileName, i: number) => {
      const file = files.filter((file: string) => {
        return file === fileName;
      })[0];

      return file;
    }
  );

  return verifiedFiles.length === verifiedFilesDataWithoutIndexes.length;
}
