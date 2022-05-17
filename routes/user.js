const express = require("express");
const { getAllUsers } = require("../controllers/user");
const { verifyToken } = require("../middleware/authJWT");
const router = express.Router();

router.route("/").get(verifyToken, getAllUsers);

module.exports = router;
