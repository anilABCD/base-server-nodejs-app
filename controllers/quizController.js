"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQuize = exports.createQuize = exports.getQuize = exports.getAllQuizes = void 0;
const AppError_1 = __importDefault(require("../ErrorHandling/AppError"));
const catchAsync_1 = __importDefault(require("../ErrorHandling/catchAsync"));
const Quize_1 = __importDefault(require("../Model/Quize"));
const filterObj = require("../utils/filterObj");
const getAllQuizes = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const quizes = yield Quize_1.default.find();
    res.status(200).json(quizes);
}));
exports.getAllQuizes = getAllQuizes;
const getQuize = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const quize = yield Quize_1.default.findById(req.params.id);
    if (!quize) {
        next(new AppError_1.default("Quize not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            quize,
        },
    });
}));
exports.getQuize = getQuize;
const createQuize = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newQuize = new Quize_1.default();
    newQuize.key = req.body.topic; //key
    yield newQuize.save();
    // 201 created
    res.status(201).json({
        status: "success",
        data: {
            quize: newQuize,
        },
    });
}));
exports.createQuize = createQuize;
const updateQuize = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const quize = Quize_1.default.findById(req.params.id);
    if (!quize) {
        next(new AppError_1.default("Quize not found", 404));
    }
    filterObj(quize, req.body, ["key"]);
    yield quize.save();
    res.status(200).json({
        status: "success",
        data: {
            updatedQuize: quize,
        },
    });
}));
exports.updateQuize = updateQuize;
