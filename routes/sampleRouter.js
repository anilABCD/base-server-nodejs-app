const express = require("express");
const sampleController = require("../controllers/sampleController");

const sampleRouter = express.Router();

sampleRouter.route("/").get(sampleController.getSampleData);

module.exports = sampleRouter;
