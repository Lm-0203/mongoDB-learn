const express = require("express");
const adminRouter = express.Router();

adminRouter.post("/login", (req, res) => {
  const { loginId, loginPwd } = req.body;
  res.header(
    "set-cookie",
    "token=23442; path=/; domain=localhost; max-age=3600"
  );
  res.status(200).json({
    message: "success",
  });
});

module.exports = adminRouter;
