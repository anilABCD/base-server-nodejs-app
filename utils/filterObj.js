"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterObject = (bodyObj, propertyKeysToUpdate) => {
    let newObj = {};
    Object.keys(bodyObj).forEach((el) => {
        propertyKeysToUpdate.forEach((key) => {
            if (key === el) {
                if (bodyObj[el]) {
                    newObj[el] = bodyObj[el];
                }
            }
        });
    });
    return newObj;
};
exports.default = filterObject;
