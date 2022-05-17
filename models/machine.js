const mongoose = require("mongoose");

const machineSchema = mongoose.Schema({
  machineID: {
    type: String,
    required: true,
    unique: true,
  },
  type: String,
  // records: [{ type: mongoose.Schema.Types.ObjectId, ref: "Record" }],
});

const Machine = mongoose.model("Machine", machineSchema);

module.exports = Machine;
