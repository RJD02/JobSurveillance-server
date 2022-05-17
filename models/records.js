const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
  date: Date,
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
  machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine" },
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
