const mongoose = require("mongoose");

const workerSchema = mongoose.Schema({
  name: String,
  EmpID: { type: String, unique: true, required: true },
  department: String,
  machines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Machine" }],
});

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
