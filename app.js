"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const errorController_1 = __importDefault(require("./ErrorHandling/errorController"));
const AppError_1 = __importDefault(require("./ErrorHandling/AppError"));
const limiter = (0, express_rate_limit_1.rateLimit)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP , Please try again in a hour",
});
const app = (0, express_1.default)();
// Request logger
app.use((0, morgan_1.default)("dev"));
// 1) Setting Security HTTP Headers
app.use((0, helmet_1.default)());
// 2) Rate Limiter
app.use(limiter);
// 3) JSON Body Parser + Data Limiter
app.use(express_1.default.json({ limit: "10kb" }));
// 4) Data Sanitization
app.use((0, express_mongo_sanitize_1.default)());
// 5) Data sanitization against xss
app.use((0, xss_clean_1.default)());
// 6) Preventing parameter pollution
app.use((0, hpp_1.default)({
    whitelist: ["duration"],
}));
const sampleRouter = require("./routes/sampleRouter");
const quizRouter = require("./routes/quizRouter");
app.use("/sampleRoute/", sampleRouter);
app.use("/quize/", quizRouter);
app.get("/", (req, res, next) => {
    res.status(200).send("<h1>Hello World</h1>");
});
// 404 NOTE: all("*") : get, post, patch , delete All URLs .
app.all("*", (req, res, next) => {
    // res.status(404).json({
    //   status: "fail",
    //   message: `Can't find ${req.originalUrl} on this server.`,
    // });
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server.`, 404));
});
// Final Operational/Non Operational Error Handling ...
app.use(errorController_1.default);
exports.default = app;
