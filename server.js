import { exec } from 'child_process';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({ error: '명령어를 입력하세요' });
    }

    // 보안상 명령어 제한을 두는 것이 중요합니다.
    // 아래는 위험한 명령어 실행을 방지하는 예시입니다.
    const allowedCommands = ['dir', 'echo', 'ping'];  // 허용된 명령어 예시
    if (!allowedCommands.some(cmd => command.startsWith(cmd))) {
      return res.status(403).json({ error: '허용되지 않은 명령어입니다' });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: `exec error: ${error.message}` });
      }
      if (stderr) {
        return res.status(500).json({ error: `stderr: ${stderr}` });
      }
      res.status(200).json({ output: stdout });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
