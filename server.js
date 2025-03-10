const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

// POST 요청을 받아서 쉘 명령어 실행
app.post('/api/execute-shell', (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: '명령어를 입력하세요' });
  }

  // 명령어 실행
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `exec error: ${error.message}` });
    }
    if (stderr) {
      return res.status(500).json({ error: `stderr: ${stderr}` });
    }
    res.status(200).json({ output: stdout });
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
const WebSocket = require('ws');

// WebSocket 서버 생성
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', ws => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  ws.on('message', message => {
    console.log(`클라이언트로부터 메시지 받음: ${message}`);

    // 받은 명령어를 실행
    exec(message, (error, stdout, stderr) => {
      if (error) {
        ws.send(`exec error: ${error.message}`);
        return;
      }
      if (stderr) {
        ws.send(`stderr: ${stderr}`);
        return;
      }
      ws.send(stdout);
    });
  });
});
