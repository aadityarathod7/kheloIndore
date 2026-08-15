const { Client } = require('c:/Users/Dell/Downloads/kheloIndore-main (1)/kheloIndore-main/backend/node_modules/ssh2');

const conn = new Client();

function executeCommands(commands) {
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('SSH connection established.');
      const commandStr = commands.join(' && ');
      
      conn.exec(commandStr, (err, stream) => {
        if (err) return reject(err);
        
        let stdout = '';
        let stderr = '';

        stream.on('close', (code, signal) => {
          conn.end();
          resolve({ code, stdout, stderr });
        }).on('data', (data) => {
          stdout += data.toString();
          console.log(data.toString());
        }).stderr.on('data', (data) => {
          stderr += data.toString();
          console.error(data.toString());
        });
      });
    }).on('error', (err) => {
      reject(err);
    }).connect({
      host: '185.199.53.80',
      port: 22,
      username: 'root',
      password: 'OneHope@12345',
      readyTimeout: 20000
    });
  });
}

const cmds = [
  'echo "=== Nginx Sites Enabled ==="',
  'ls -la /etc/nginx/sites-enabled/',
  'echo "=== Nginx Config Content ==="',
  'cat /etc/nginx/sites-enabled/* || true',
  'echo "=== Certbot Certificates ==="',
  'certbot certificates || true'
];

executeCommands(cmds);
