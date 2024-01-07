const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

// 启用CORS（所有源）
app.use(cors());

// JSON数据接口
app.get('/json-data', (req, res) => {
    res.json({ message: 'Hello World', data: [1, 2, 3, 4, 5] });
});

// 流式数据接口
app.get('/stream-data', (req, res) => {
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
