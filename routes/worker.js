const { signup } = require("../controllers/authController");
const express = require("express");
const fs = require("fs");
const Machine = require("../models/machine");
const Worker = require("../models/worker");
const ErrorResponse = require("../utils/errorResponse");
const workerRouter = express.Router();

/* 
When files comes in, you should add all the new contents to the db
*/

workerRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const worker = await Worker.findOne({ _id: id });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }
    await worker.populate("machines");
    return res.status(201).json({
      success: true,
      worker,
    });
  } catch (err) {
    return next(new ErrorResponse("Internal Server Error", 500));
  }
});

workerRouter.get("/", async (req, res) => {
  const workers = await Worker.find({});
  console.log();
  if (workers) {
    res.status(200).send({ workers: workers });
    return;
  }
  res
    .status(404)
    .send({ message: "Something went wrong when finding all workers" });
});

workerRouter.post("/", async (req, res) => {
  const newWorker = new Worker({
    name: req.body.name,
    EmpID: req.body.EmpID,
    department: req.body.department,
    machines: [],
  });
  try {
    await newWorker.save();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while creating new worker", error: err });
  }
  res.status(201).json({
    message: `Successfully created new worker with EmpID: ${newWorker.EmpID}`,
  });
});

workerRouter.post("/:id/:machineID", async (req, res) => {
  const worker = Worker.find({ EmpID: req.params.id });
  const machine = Machine.find({ machineID: req.params.machineID });
  worker.machines.push(machine);
  try {
    await worker.save();
  } catch (err) {
    res.send({
      message: `Error while saving machineID: ${machine.machineID} to worker: ${worker.EmpID}`,
    });
  }
  res.send({
    message: `Successfully connected machineID: ${machine.machineID} to worker: ${worker.EmpID}`,
  });
});

module.exports = workerRouter;
