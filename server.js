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
