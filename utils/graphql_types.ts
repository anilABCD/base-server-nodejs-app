type Folder_QueriesMutationsTsTemplates_StringType =
  "queries.mutation.ts.templates";

function Folder_QueriesMutationsTsTemplates_StringType(
  str: Folder_QueriesMutationsTsTemplates_StringType
) {
  return str;
}

type SingleOutFile_StringType = "/types.ts";
function SingleOutFile_StringType(str: SingleOutFile_StringType) {
  return str;
}

type OutPutReactNativeAppPath_StringType =
  "./../base-react-native-app/graphql/CURRENT_APP/";
function OutPutReactNativeAppPath_StringType(
  str: OutPutReactNativeAppPath_StringType
) {
  return str;
}

type GraphQLFile_StringType =
  | "input"
  | "type"
  | "mutation"
  | "querys.and.mutations";
function GraphQLFile_StringType(str: GraphQLFile_StringType) {
  return str;
}

type GQL_Scalar_StringTypes =
  | " ID"
  | " String"
  | " Float"
  | " Boolean"
  | " Int";
function GQL_Scalar_StringTypes(str: GQL_Scalar_StringTypes) {
  return str;
}

type Dot = ".";
function Dot(str: Dot) {
  return str;
}

type CURRENT_APP = "CURRENT_APP";
function CURRENT_APP(str: CURRENT_APP) {
  return str;
}

type TS_StringTypes = " string" | " boolean" | " number";
function TS_StringTypes(str: TS_StringTypes) {
  return str;
}

type Exp_StringTypes = "{" | "}" | "!" | "[" | "]";
function Exp_StringTypes(str: Exp_StringTypes) {
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
  type: GraphQLFile_StringType;
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
  Folder_QueriesMutationsTsTemplates_StringType,
  SingleOutFile_StringType,
  OutPutReactNativeAppPath_StringType,
  GraphQLFile_StringType,
  GQL_Scalar_StringTypes,
  Dot,
  CURRENT_APP,
  TS_StringTypes,
  Exp_StringTypes,
  TypeOfExtesions_StringTypes,
  FileAndTypesDataInfo,
  TypeInfo,
  PropertyInfo,
  GraphQLToTS,
};
