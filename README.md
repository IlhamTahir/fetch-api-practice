# FetchApi流式处理的封装



## 基础知识

Fetch API是一种现代的网络通信技术，用于在Web浏览器中发送HTTP请求。它提供了一个强大且灵活的方法来从网络请求资源，是XMLHttpRequest（XHR）的一个现代替代品。Fetch API提供了更强大和更灵活的功能集，特别是在处理JSON数据、流式数据和承诺（Promise）方面。

其他组件： `axios`

- **基于Promise的API**：Fetch API使用Promises，这使得处理异步操作更简单、更清晰。它避免了传统的回调地狱，使代码更易于理解和维护。
- **默认不发送或接收cookies** ：出于安全原因，Fetch默认不会发送或接收cookies。如果需要，必须明确设置。
- **灵活的请求和响应对象** ：Fetch API使用Request和Response对象，提供更强大的控制能力，例如可以很容易地修改或查询请求和响应的各个部分。
- **支持Stream API** ：Fetch可以处理接收到的数据流，这对于处理大型响应或流式传输非常有用。
- **支持Service Workers** ：Fetch是Service Workers的一个重要部分，它们允许在网络请求和响应之间添加自定义逻辑，如缓存策略。



```ts
fetch(url, config).then(res: Response => 。。。return).then(res->).catch
```



## 实验环境



## express应用去实现模拟的json请求、stream请求



#### 初始化项目



```
pnpm init
```



#### 安装Express



```
pnpm install express
```



#### express应用



```
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// 启用CORS（所有源）
app.use(cors());

// JSON数据接口
app.get('/jsonData', (req, res) => {
    res.json({ message: 'Hello World', data: [1, 2, 3, 4, 5] });
});

// 流式数据接口
app.get('/streamData', (req, res) => {
    const interval = req.query.interval ? parseInt(req.query.interval) : 100; // 每个数据块之间的间隔时间（毫秒），默认0.5秒
    const filePath = './data.txt'; // 文件路径
    const stream = fs.createReadStream(filePath, {highWaterMark: 10 }); // 不指定编码，以得到Buffer

    res.setHeader('Content-Type', 'application/octet-stream');

    let isPaused = false;

    stream.on('data', (chunk) => {
        if (!isPaused) {
            const uint8Array = new Uint8Array(chunk); // 将Buffer转换为Uint8Array
            res.write(Buffer.from(uint8Array)); // 发送Uint8Array数据
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                stream.resume();
            }, interval);
            stream.pause();
        }
    });

    stream.on('end', () => {
        res.end();
    });

    stream.on('error', (error) => {
        console.error('Error reading file:', error);
        res.status(500).send('Error reading file');
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

```



#### 安装同源策略中间件



```
pnpm install cors
```
