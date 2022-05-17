const express = require("express");
const {
  getAllMachines,
  registerMachine,
  deleteMachine,
  updateMachine,
  getMachine,
} = require("../controllers/machine");

const machineRouter = express.Router();

machineRouter.route("/:id").get(getMachine);
machineRouter.route("/").get(getAllMachines);

machineRouter.route("/").post(registerMachine);

machineRouter.route("/:id").delete(deleteMachine);

machineRouter.route("/:id").put(updateMachine);

module.exports = machineRouter;
