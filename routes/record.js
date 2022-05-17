const express = require("express");
const { createRecord, getRecords } = require("../controllers/record");
const recordRouter = express.Router();

recordRouter.route("/").post(createRecord);

recordRouter.route("/").get(getRecords);

module.exports = recordRouter;
