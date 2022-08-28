//用于解析token
// const { pathToRegexp } = require("path-to-regexp");
// const reg = pathToRegexp("/api/student/:id");
// console.log(reg.test("/api/student/234"));
module.exports = (req, res, next) => {
  // 如果是登录接口，不需要验证token
  if (req.path === "/admin/login") {
    next();
    return;
  }
  let token = req.cookies?.token || req.headers.authorization;
  if (!token) {
    // 没有认证
    handleNoneToken(req, res, next);
    return;
  }
  // check token
  next();
};

function handleNoneToken(req, res, next) {
  res.status(403).send({
    message: "没有权限",
  });
}
