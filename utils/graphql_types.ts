type GQL_Root_Type = "Query" | "Mutation";
function GQL_Root_Type(str: GQL_Root_Type) {
  return str;
}

type FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations =
  "queries.mutation.ts.templates";
function FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations(
  str: FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations
) {
  return str;
}

const GQL_TS_FILES_EXCLUDED = ["resolvers.ts"];

const GLQ_Files_Excluded: string[] = ["schema.graphql"];

type SingleTypeScriptOutFile = "/types.ts";
function SingleTypeScriptOutFile(str: SingleTypeScriptOutFile) {
  return str;
}

type OutPathReactNative_AppName =
  "./../base-react-native-app/graphql/CURRENT_APP/";
function OutPathReactNative_AppName(str: OutPathReactNative_AppName) {
  return str;
}

type GQLFileType = "input" | "type" | "mutation" | "querys.and.mutations";
function GQLFileType(str: GQLFileType) {
  return str;
}

type GQL_ScalarType = " ID" | " String" | " Float" | " Boolean" | " Int";
function GQL_ScalarType(str: GQL_ScalarType) {
  return str;
}

type FileExtension = ".ts";
function FileExtension(str: FileExtension) {
  return str;
}

function resturnStringTypeAsAnyString(str: string) {
  return str;
}

type CURRENT_APP = "CURRENT_APP";
function CURRENT_APP(str: CURRENT_APP) {
  return str;
}

type TS_ScalarTypes = " string" | " boolean" | " number";
function TS_ScalarTypes(str: TS_ScalarTypes) {
  return str;
}

type From_GQL_Type = "schema " | "mutation ";
function From_GQL_Type(str: From_GQL_Type) {
  return str;
}

type TO_TS_Type = "type Schema " | "type ";
function TO_TS_Type(str: TO_TS_Type) {
  return str;
}

type GQL_Input = "input" | "input ";
function GQL_Input(str: GQL_Input) {
  return str;
}

type GQL_Type = "type" | "type ";
function GQL_Type(str: GQL_Type) {
  return str;
}

type ExportSyntax = "export { TYPE_NAME } ";
function ExportSyntax(str: ExportSyntax) {
  return str;
}

type ExpressionChar = "{" | "}" | "!" | "[" | "]" | ";" | ":" | "(" | ")" | ",";
function ExpressionChar(str: ExpressionChar) {
  return str;
}

type ExpressionToTS = "= { \r\n" | "?:";

function ExpressionToTS(str: ExpressionToTS) {
  return str;
}

// ".template" for future ... templates if any ...
type TypeOfExtesions_StringTypes = ".graphql" | ".template";
function TypeOfExtesions_StringTypes(str: TypeOfExtesions_StringTypes) {
  return str;
}

type GraphQLToTS = {
  fileNames: string[];
  appName: string;
  fileAndDataWithTypesInfo: FileAndTypesDataInfo[];
  allTypesCombined?: TypeInfo[];
};

type PropertyInfo = {
  propertyName: string;
  typeName: string;
  propertyType?: TypeInfo;
  propertyTypeAttachedTypeName?: string;
};

type TypeInfo = {
  properties: PropertyInfo[];
  typeName: string;
  isPureType?: boolean;
  dependentTypes?: string[];
  folderToCreate: string;
  importUrl: string;
  fileName: string;
};

type FileAndTypesDataInfo = {
  fileName: string;
  type: GQLFileType;
  convertedTsDataString: string;
  folderToCreate: string;
  allTypesInSingleFile: string[];
  allTypesInSingleFileCount: number;
  typesAndProperties: TypeInfo[];
  typesAndPropertiesCount: number;
  allOtherDependentTypesFromPropertyTypesFromOtherFiles: string[];
  importUrl: string;
};

export {
  FolderTemplate_TS_File_For_Generating_Direct_QueriesAndMutations,
  SingleTypeScriptOutFile,
  OutPathReactNative_AppName,
  GQLFileType,
  GQL_ScalarType,
  CURRENT_APP,
  TS_ScalarTypes,
  ExpressionChar,
  TypeOfExtesions_StringTypes,
  FileAndTypesDataInfo,
  TypeInfo,
  PropertyInfo,
  GraphQLToTS,
  From_GQL_Type,
  ExportSyntax,
  GQL_Root_Type,
  GQL_Input,
  GQL_Type,
  TO_TS_Type,
  ExpressionToTS,
  FileExtension,
  GLQ_Files_Excluded,
  GQL_TS_FILES_EXCLUDED,
};
