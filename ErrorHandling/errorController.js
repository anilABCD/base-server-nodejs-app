"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorController = (err, req, res, next) => {
    console.log("**********From Error Controller ********");
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
};
exports.default = errorController;
