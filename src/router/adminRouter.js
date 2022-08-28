const express = require("express");
const adminRouter = express.Router();

adminRouter.post("/login", (req, res) => {
  const { loginId, loginPwd } = req.body;
  res.cookie("token", "123456", {
    path: "/",
    domain: "localhost",
    maxAge: 7 * 24 * 3600 * 1000, // 注意：这里是毫秒数
  });
  // 针对除了浏览器之外的其他设备，如何得到认证
  res.header('authorization', value);
  res.status(200).json({
    message: "success",
  });
});

module.exports = adminRouter;
