const Machine = require("../models/machine");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllMachines = async (req, res, next) => {
  try {
    const machines = await Machine.find({});

    res.status(201).json({
      success: true,
      data: machines,
    });
  } catch (error) {
    return next(error);
  }
};

exports.registerMachine = async (req, res, next) => {
  const { type, machineID } = req.body;
  try {
    await Machine.create({
      type,
      machineID,
    });

    res.status(201).json({
      success: true,
      data: "Created machine successfully",
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteMachine = async (req, res, next) => {
  const { id } = req.params;
  try {
    const machine = await Machine.findOne({ id });
    if (!machine) {
      return next(new ErrorResponse("Machine not found", 404));
    }
    await machine.delete();
    res.status(201).json({
      success: true,
      data: "Machine deleted",
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateMachine = async (req, res, next) => {
  const { id } = req.params;
  const { machineID, type } = req.body;
  try {
    const machine = await Machine.findOne({ id });
    if (!machine) {
      return next(new ErrorResponse("Machine not found", 404));
    }
    console.log("Machine found", machine);
    machine.machineID = machineID;
    machine.type = type;
    console.log(machine);
    await machine.save();
    res.status(201).json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMachine = async (req, res, next) => {
  const { id } = req.params;
  try {
    const machine = await Machine.findOne({ id });
    if (!machine) {
      return next(new ErrorResponse("Machine doesn't exist"));
    }

    res.status(201).json({
      success: true,
      data: machine,
    });
  } catch (err) {
    return next(err);
  }
};
