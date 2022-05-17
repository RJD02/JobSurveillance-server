const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(
    `mongodb+srv://${process.env.MONGO_PASSWORD}@cluster0.lkxsz.mongodb.net/JobDB?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("MONGO CONNECTION OPEN");
};

module.exports = connectDB;
