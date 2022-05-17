const formidable = require("formidable");
const fs = require("fs");
const { parse } = require("csv-parse");
const Record = require("../models/records");
const Machine = require("../models/machine");
const Worker = require("../models/worker");
const ErrorResponse = require("../utils/errorResponse");
const parser = parse({ delimiter: "," });

exports.getRecords = async (req, res, next) => {
  try {
    const records = await Record.find();
    if (!records) {
      return next(new ErrorResponse("No records exist", 404));
    }
    const resRecords = [];
    for (let i = 0; i < records.length; i++) {
      let record = await records[i].populate("worker");
      record = await record.populate("machine");
      resRecords.push(record);
    }
    console.log(resRecords);
    return res.status(201).json({
      success: true,
      resRecords,
    });
  } catch (err) {
    return next(err);
  }
};

exports.createRecord = async (req, res, next) => {
  const file = formidable({ multiples: true });

  file.parse(req, (err, fields, files) => {
    if (err) {
      return next(err);
    }
    console.log(files.file.originalFilename);
    console.log(files.file.filepath);
    const oldPath = files.file.filepath;
    const newPath = "../examples/first.csv";
    fs.rename(oldPath, newPath, (err) => {
      if (err.code == "EXDEV") copy(oldPath, newPath, () => {});
      storeRecord();
      res.status(201).json({
        success: true,
      });
    });
  });
};

const copy = (oldPath, newPath, callback) => {
  var readStream = fs.createReadStream(oldPath);
  var writeStream = fs.createWriteStream(newPath);

  readStream.on("error", callback);
  writeStream.on("error", callback);

  readStream.on("close", function () {
    fs.unlink(oldPath, callback);
  });

  readStream.pipe(writeStream);
};

const storeRecord = async () => {
  const csvData = [];
  fs.createReadStream("./examples/first.csv")
    .pipe(parse({ delimiter: "," }))
    .on("data", (csvRow) => {
      csvData.push(csvRow);
    })
    .on("end", async () => {
      // Add records to database

      console.log(convertTZ(Date(csvData[0][0]), "Asia/Kolkata"));
      for (let i = 0; i < csvData.length; i++) {
        csvData[i] = {
          date: new Date(csvData[i][0]),
          machine: csvData[i][1],
          worker: csvData[i][2],
        };
        const machine = await Machine.findOne({
          machineID: csvData[i]["machine"],
        });
        let worker = await Worker.findOne({ EmpID: csvData[i]["worker"] });

        const filteredLength = worker.machines.filter(
          (val) => val.toString() === machine._id.toString()
        ).length;

        if (filteredLength === 0) {
          worker.machines.push(machine);
          await worker.save();
        }
        await Record.create({
          data: Date.now(),
          worker,
          machine,
        });
      }
      // Delete the csv file
      fs.unlink("../examples/first", (err) => {
        // if (err) console.log("Error deleting the file", err);
        console.log("Successfully deleted the file");
      });
      return true;
    });
  return false;
};

const convertTZ = (date, tzString) => {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
};
