const express = require("express");
const path = require("path");
const staticRoot = path.resolve(__dirname, "./public");
// app 实际上是一个函数，用于处理请求的函数
const app = express(); // 创建一个express应用

const port = 5008;

/**
 * 下面这段代码的作用：
 * 当请求时，会根据请求的路径，从指定目录中寻找是否存在该文件，如果存在，直接响应文件内容，而不再移交给后续的处理函数
 * 如果不存在文件，则直接移交给后续的中间价处理
 * use 有一个基础路径，req.baseUrl
 * 默认情况下，如果映射的结果是一个目录，则会自动使用index.html文件，默认文件可以进行配置，用index属性
 */
app.use(express.static(staticRoot), {
  index: "index.html",
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(exporess.json());

app.get("/abc", (req, res, next) => {
  // req res 都是被express封装后的对象
  // res.send();
  // res.status().header('location', 'https://www.baidu.com').end();
  // res.status(200).location('https://duyi.ke.qq.com').end();
  res.send([1, 2, 3]);
});

app.listen(port, () => {
  console.log(`server listen on ${port}`);
});
