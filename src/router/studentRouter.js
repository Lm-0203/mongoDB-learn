const express = require("express");
const studentRouter = express.Router();

studentRouter.get("/getStudent", (req, res) => {
  res.send([123, 456, 789]);
});

module.exports = studentRouter;
