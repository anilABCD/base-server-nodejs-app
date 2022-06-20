const filterObject = (dbObj, bodyObj, propertyKeysToUpdate) => {
  Object.keys(dbObj).forEach((el) => {
    propertyKeysToUpdate.forEach((key) => {
      if (key === el) {
        if (bodyObj[el]) {
          dbObj[el] = bodyObj[el];
        }
      }
    });
  });
};

module.exports = filterObject;
