const express = require("express");
const path = require("path");
const staticRoot = path.resolve(__dirname, "./public");
const cookieParser = require("cookie-parser");
// app 实际上是一个函数，用于处理请求的函数
const app = express(); // 创建一个express应用
const studentRouter = require("./src/router/studentRouter");
const adminRouter = require("./src/router/adminRouter");

// 加入 cookie-parse 中间件
// cookieParser 是一个函数，这个函数调用，会返回一个中间件
// 加入这个中间件之后，会在req对象中，注入一个cookies属性，用于获取所有请求传递过来的cookies
// 加入这个中间件之后，会在所有res对象中，注入cookie方法，用于设置cookie
app.use(cookieParser());
/**
 * 下面这段代码的作用：
 * 当请求时，会根据请求的路径，从指定目录中寻找是否存在该文件，如果存在，直接响应文件内容，而不再移交给后续的处理函数
 * 如果不存在文件，则直接移交给后续的中间价处理
 * use 有一个基础路径，req.baseUrl
 * 默认情况下，如果映射的结果是一个目录，则会自动使用index.html文件，默认文件可以进行配置，用index属性
 */
app.use(
  express.static(staticRoot, {
    index: "index.html",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.listen(3009, () => {
  console.log(`server listen on ${3009}`);
});
