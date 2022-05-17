const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");

exports.getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (err) {
    return next(new ErrorResponse("Something went wrong", 401));
  }
};
