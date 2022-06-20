const AppError = require("../ErrorHandling/AppError");
const catchAsync = require("../ErrorHandling/catchAsync");
const Quize = require("../Model/Quiz");
// const filterAndUpdateObject = require("../utils/filterAndUpdateObject");

const getAllQuizes = catchAsync(async (req, res, next) => {
  const quizes = await Quize.find();
  res.status(200).json(quizes);
});

const getQuize = catchAsync(async (req, res, next) => {
  const quize = await Quize.findById(req.params.id);

  if (!quize) {
    next(new AppError("Quize not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      quize,
    },
  });
});

const createQuize = catchAsync(async (req, res, next) => {
  const newQuize = new Quize();
  newQuize.key = req.body.topic; //key
  await newQuize.save();

  // 201 created
  res.status(201).json({
    status: "success",
    data: {
      quize: newQuize,
    },
  });
});

const updateQuize = catchAsync(async (req, res, next) => {
  const quize = Quize.findById(req.params.id);

  if (!quize) {
    next(new AppError("Quize not found", 404));
  }

  // filterAndUpdateObject(quize, req.body, ["key"]);

  await quize.save();

  res.status(200).json({
    status: "success",
    data: {
      updatedQuize: quize,
    },
  });
});

exports.getAllQuizes = getAllQuizes;
exports.getQuize = getQuize;
exports.createQuize = createQuize;
exports.updateQuize = updateQuize;
