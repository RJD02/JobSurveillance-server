const express = require("express");
const { createRecord } = require("../controllers/record");
const recordRouter = express.Router();

recordRouter.route("/").post(createRecord);

module.exports = recordRouter;
