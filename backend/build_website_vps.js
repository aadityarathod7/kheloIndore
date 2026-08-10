const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established.');

  conn.sftp((err, sftp) => {
    if (err) throw err;

    const localPath = 'c:/Users/Dell/Downloads/kheloindore-project/frontend-website/src/feature-module/pages/terms-condition.tsx';
    const remotePath = '/var/www/kheloindore/frontend-website/src/feature-module/pages/terms-condition.tsx';

    console.log(`Uploading ${localPath} to VPS ${remotePath}...`);

    sftp.fastPut(localPath, remotePath, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        conn.end();
        return;
      }
      console.log('Upload successful! Building frontend-website on VPS...');

      const commands = [
        'echo "=== Installing dependencies for frontend-website ==="',
        'cd /var/www/kheloindore/frontend-website',
        'npm install --legacy-peer-deps',
        'echo ""',
        'echo "=== Building frontend-website ==="',
        'npm run build',
        'echo ""',
        'echo "=== Copying website build files to backend public directory ==="',
        'mkdir -p /var/www/kheloindore/backend/public/site/build',
        'cp -rf /var/www/kheloindore/frontend-website/build/* /var/www/kheloindore/backend/public/site/build/',
        'echo "Copy complete!"',
        'echo ""',
        'echo "=== Restarting PM2 Backend Server ==="',
        'pm2 restart kheloindore-api',
        'pm2 save',
        'echo "Deployment and website reload finished successfully!"'
      ];

      conn.exec(commands.join(' && '), (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
          console.log(`Build process finished with exit status: ${code}`);
          conn.end();
        }).on('data', (data) => {
          process.stdout.write(data);
        }).stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      });
    });
  });
}).connect({
  host: '185.199.53.80',
  port: 22,
  username: 'root',
  password: 'OneHope@12345'
});
