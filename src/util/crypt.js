// 使用对称加密算法 aes 128
// 128 位的秘钥 也就是 16个字节的字符串
const SECRET = Buffer.from("b94jnr445ecfit7v");
const crypto = require("crypto");
// const results = crypto.getCiphers();

// 准备一个iv，随机向量，秘钥一般固定，向量一般不固定
const iv = Buffer.from(
  Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
);
module.exports = {
  encrypt(str) {
    const cry = crypto.createCipheriv("aes-128-cbc", SECRET, iv); // 返回一个函数
    let result = cry.update(str, "utf-8", "hex");
    result += cry.final("hex");
    return result;
  },
  decrypt(str) {
    const decry = crypto.createDecipheriv("aes-128-cbc", SECRET, iv);
    let result = decry.update(str, "hex", "utf-8");
    result += decry.final("utf-8");
    return result;
  },
};
