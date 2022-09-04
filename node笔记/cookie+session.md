# cookie 的组成

cookie 是浏览器特有的一个概念，管理着各个网站的身份信息

每个cookie就相当于是属于某个网站的一个卡片，它记录了下面的信息

+ key
+ value
+ domain：域，表达这个cookie是属于哪个网站的，比如hireez.com，表示这个cookie是属于hireez这个网站的
+ path：路径。表示这个cookie是属于该网站的哪个基路径的，就好比是同一家公司不同部门会颁发不同的出入证。比如  `/news`，表示这个cookie是属于 `/news` 这个路径的。
+ secure： 是否使用安全传输, ,
+ expire： 过期时间，表示该cookie在什么时候过期



当浏览器向服务器发送一个请求的时候，会看看自己的cookie

如果一个cookie同时满足以下条件，则这个cookie会被附带到请求中：

+ cookie没有过期
+ cookie中的域和这次请求的基域是匹配的
  + 比如cookie中的域是`hireez`，则可以匹配的请求域有`hireez`, `www.hireez`, `blogs.hireez` 等
  + 比如 cookie 中的域是 `www.yanjin.tech`, 则只能匹配 `www.yuanjin.tech` 这样的请求域
  + cookie 不在乎端口，只要域匹配就可以
+ cookie中的path和这次请求的path是匹配的
  + 比如cookie中的path是 `/news`, 则可以匹配的请求路径是 `/news`, `/news/detail`, `/news/a/b/c` 等，但不能匹配 `/blogs`
  + 如果cookie的path 是 `/` ,可以匹配所有路径
+ 验证cookie的安全传输
  + 如果cookie的secure属性是true，则请求协议必须是https，否则不会发送该cookie
  + 如果cookie的secure属性是false，则请求协议可以是http，也可以是https



如果一个cookie满足了上面所有条件，则浏览器会把它自动加入这次请求中

具体的加入方式是，浏览器会将符合条件的cookie，自动放到请求头中。

例如：当我们在浏览器访问百度时，他会在请求头中会附带cookie，格式是 `key=value;key=value;key=value`,每一个键值对就是一个符合条件的cookie

cookie中包含了重要的身份信息，永远不要把cookie泄露给别人。否则，其他人拿到别人的证件，有了证件，就有了为所欲为的可能性。



# 如何设置cookie

由于cookie 同时保存在浏览器端的，同时，很多证件又是服务器颁发的。

所以，cookie有两种模式：

+ 服务器响应：这种模式非常普遍，当服务器决定给客户端颁发一个证件时，他会在响应的消息中包含cookie，浏览器会自动把cookie保存到卡包中
+ 客户端自行设置：这种模式少见一些，不过也有可能发生，比如某个用户关闭了某个广告，并选择了【以后不要给我再弹出】，此时就可以把这种小信息直接通过浏览器的js代码保存在cookie中。后续请求服务器时，服务器会看到客户端不想要再次弹出广告的cookie，于是就不会再发送广告了。

# 服务器端设置cookie

服务器可以通过设置响应头，来告诉浏览器应该如何设置cookie

响应头按照下面的格式设置

```js
Set-Cookie: cookie1
Set-Cookie: cookie2
...
```

通过这种模式，就可以在一次响应中设置多个cookie了，具体设置多少个cookie，设置什么cookie，根据你的需要自行处理。

其中，每个cookie的格式如下：

`key=value; path=?' domain=?; expire=?; max-age=?; secure; httponly`

每个cookie除了键值对是必须要设置的，其他属性都是可选的，并且顺序不限

当这样的响应头到达客户端后，浏览器会自动将cookie保存到卡包中，如果卡包中已经存在一模一样的卡片（其他的key，path，domain相同），则会自动的覆盖之前的设置。

下面，一次说明每个属性值：

+ **path**：设置cookie的路径。如果不设置，浏览器将其自动设置为当前请求的路径。比如浏览器请求的地址是 `/login`, 服务器响应了一个`set-cookie: a=1`,浏览器会将该cookie的path设置为请求路径的`/login`
+ **domain**：设置cookie的域。如果不设置，浏览器会自动将其设置为当前的请求域。比如：浏览器请求的地址是`https://www.baidu.com`，服务器响应了一个 `set-cookie: a=1`,浏览器会将该cookie的domain设置为请求的域`www.baidu.com`,
  + 这里值得注意的是：如果一个服务器响应了一个无效的域，浏览器是不认的。
  + 什么是无效的域？就是响应的域连根域都不一样。比如，浏览器请求的域是`yuanjing.tech`，服务器响应的cookie是`set-cookie: a=1; domain=baidu.com`，这样的域浏览器是不认的。
  + 如果浏览器连这样的情况都允许，就以为着张三的服务器，有权给用户一个cookie，用于访问李四的服务器，这会造成很多安全性问题。
+ **expire**：设置cookie的过期时间。这里必须是一个有效的GMT时间，即格林威治标准时间字符串，比如`Sun Aug 28 2022 06:30:18 GMT`，表示格林威治的时间`2022-08-28 06:30:18`，表示北京时间 `Sun Aug 28 2022 14:30:18 GMT+0800`，当客户端达到这个时间后，会自动销毁该cookie。
+ **max-age**：设置cookie的相对有效期。expire和max-age通常只设置一个就行。比如设置 **max-age** 为 `1000`， 浏览器在添加cookie时，会自动设置它的expire为当前时间加上 1000 秒，作为过期时间。
  + 如果不设置expire，又没有设置max-age，表示会话结束后过期。
  + 对于大部分浏览器而言，关闭所有浏览器窗口意味着会话结束
+ **secure**：设置cookie是否是安全连接。如果设置了该值，则表示该cookie后续只能随着 `https` 请求发送。如果不设置，则表示该cookie会随着所有请求发送。
+ **httponly**： 设置cookie是否仅能用于传输。如果设置了该值，表示该cookie仅能用于传输，而不允许在客户端通过JS获取，这对防止跨站脚本攻击 `(XSS)` 很有用
  + 如何通过JS获取？
  + 什么是XSS？



下面来一个例子：客户通过 post 请求服务器 `http://yuanjin.tech/login`，并在消息体重给与了账号和密码，服务器验证登录成功后，在响应头中设置了一下内容：

```
set-cookie: token=123456; path=/; max-age=3600; httponly
```



当响应到达浏览器后，浏览器会创建下面的cookie：

```js
key: token
value: 123456
domain: yuanjin.tech
path: /
expore: 2020-04-17 18:55:00 // 假设当前时间是2020-08-17 17:55:00
secure: false // 任何请求都可以附带这个cookie，只要满足其他要求
httponly: true // 不允许JS获取该cookie
```



于是随着浏览器后续对服务器的请求，只要满足要求，这个cookie就会被附带到请求头中传输给服务器：

```js
cookie: token=123456; 其他cookie...
```



# 如何删除一个浏览器的cookie

如果药删除浏览器的cookie，只需要让服务器响应一个同样的域，同样的路径，同样的key，只是时间过期的cookie就可以

所以**删除cookie就是修改cookie**

下面的响应会让浏览器删除 `token`：

```
cookie: token=; domain=yuanjin.tech; path=/; max-age=-1
```



浏览器按照要求修改了cookie后，会发现token已经过期，于是自然就删除了。

> 无论是删除还是修改，都要注意cookie的域和路径，因为完全可能存在域或者路径不同但是key相同的cookie
>
> 因此无法仅通过key确定是哪一个cookie



# 客户端设置cookie

既然cookie是存放在浏览器端的，所以浏览器向JS公开了接口，让其可以设置cookie

```js
document.cookie = "key=value; path=?; domain=?; expire=?; max-age=?; secure"
```

可以看出，在客户端设置cookie，和服务器设置cookie的格式一样，只是有下面的不同：

+ 没有httponly。因为httponly本来就是为了限制在客户端访问的，既然是在客户端配置的，自然失去了限制的意义
+ path的默认值。在服务器设置cookie时，如果没有写path，使用的时候请求的path。而在客户端设置cookie时，也许根本没有请求发生。因此，path在客户端设置时的默认值是当前网页的path
+ domain的默认值。和path同理，客户端设置时的默认值是当前网页的domain
+ 其他：和服务器一样
+ 删除cookie：和服务器一样，修改cookie的过期时间即可



# 总结

以上，就是cookie原理部分内容

如果把它应用于登陆场景，就是如下流程：

**登录请求**

1. 浏览器发送请求到服务器，附带账号密码
2. 服务器验证账号密码是否正确。如果不正确，响应错误。如果正确，在响应头中设置cookie，附带登录认证信息。至于登录认证信息怎么设计，要考虑哪些问题，可以百度jwt
3. 客户端收到cookie，浏览器自动记录下来

**后续请求**

1. 浏览器发送请求到服务器，希望添加一个管理员，并将cookie自动附带到请求中
2. 服务器先获取cookie，验证cookie中的信息是否正确，如果不正确，不予以操作。如果正确，完成正常的业务流程



# cookie 和 session 的优缺点

## cookie

优点

+ 存在客户端，不占用服务器资源

缺点

+ 只能是字符串格式
+ 存储量有限（4kb）
  + 虽然Web Storage的存储空间更大（5M），但是Web Storage中的数据仅存在本地，不与服务器发生交互
  + Cookie 中的数据会在浏览器和服务器中来回传递
+ 数据容易被获取
+ 数据容易被篡改
+ 容易丢失
  + 清除浏览器缓存数据之后就没有了，网站需要重新登录

## Session

优点

+ 存储在服务器端
+ 可以是任何格式
+ 存储量理论上是无限的
+ 数据难以被获取
+ 数据难以篡改
+ 数据不易丢失

缺点

+ 占用服务器资源，有时会需要很大的服务器成本
+ 浏览器关闭的话，服务器不知道



# Session

sessionId 一般会用uuId（universal unique identity）。保证唯一性就可以。

因为浏览器关闭的话，服务器不知道。所以 session 可能会有一个过期时间，取决于session是存在哪的。

express有一个session的中间件，是express-session;

```js
const session = require('express-session');
const express = require('express');
const app = express();
app.use(session({
    cookie: { // session 存储的信息可能会发给cookie
        secret: true
    },
    secret: string,
    name: 'sessionId', // 默认值是 connect.sid
})); // 这样就具备了session的功能

app.get('/', (req, res) => {
    console.log(req.session); // 可以从req里面直接拿到session信息
    req.session.info = {}; // 也可以给session里面直接添加属性
})
```

