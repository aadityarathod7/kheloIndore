const fs = require('fs');
const { Client } = require('c:/Users/Dell/Downloads/kheloIndore-main (1)/kheloIndore-main/backend/node_modules/ssh2');

const archivePath = 'c:\\Users\\Dell\\Downloads\\kheloIndore-main (1)\\kheloIndore-main\\deploy.tar.gz';
const remoteTar = '/var/www/kheloindore/deploy.tar.gz';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established to VPS.');

  conn.sftp((err, sftp) => {
    if (err) throw err;

    console.log('--- Uploading deploy.tar.gz ---');
    sftp.fastPut(archivePath, remoteTar, (putErr) => {
      if (putErr) {
        console.error('SFTP Put Error:', putErr);
        conn.end();
        return;
      }
      console.log('Upload complete! Extracting archive on VPS...');

      const cmds = [
        'mkdir -p /var/www/kheloindore/backend',
        'tar -xzf /var/www/kheloindore/deploy.tar.gz -C /var/www/kheloindore/backend/',
        'rm -f /var/www/kheloindore/deploy.tar.gz',
        'cd /var/www/kheloindore/backend && npm install --production',
        'pm2 restart all',
        'systemctl restart nginx',
        'echo "=== Verification ==="',
        'curl -I -s http://127.0.0.1:3037/',
        'curl -I -s http://qa.kheloindore.in/'
      ];

      conn.exec(cmds.join(' && '), (cmdErr, stream) => {
        if (cmdErr) throw cmdErr;

        stream.on('close', (code) => {
          console.log(`VPS Deployment Completed with exit code: ${code}`);
          conn.end();
        }).on('data', (d) => console.log(d.toString()))
          .stderr.on('data', (d) => console.error(d.toString()));
      });
    });
  });
}).connect({
  host: '185.199.53.80',
  port: 22,
  username: 'root',
  password: 'OneHope@12345',
  readyTimeout: 30000
});
