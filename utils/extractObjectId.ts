const extractObjectId = (objectId: any) => {
  let extractedId = objectId
    .toString()
    .replace('new ObjectId("', "")
    .replace('")', "");

  return extractedId;
};

export { extractObjectId };
