const path = require('path');
const fs = require('fs');
const { Client } = require('c:/Users/Dell/Downloads/kheloIndore-main (1)/kheloIndore-main/backend/node_modules/ssh2');

const localBackendDir = 'c:\\Users\\Dell\\Downloads\\kheloIndore-main (1)\\kheloIndore-main\\backend';
const localAdminBuildDir = 'c:\\Users\\Dell\\Downloads\\kheloIndore-main (1)\\kheloIndore-main\\frontend-admin\\build';
const localSiteBuildDir = 'c:\\Users\\Dell\\Downloads\\kheloIndore-main (1)\\kheloIndore-main\\frontend-website\\build';

const remoteBackendDir = '/var/www/kheloindore/backend';
const remoteAdminBuildDir = '/var/www/kheloindore/backend/public/admin/build';
const remoteSiteBuildDir = '/var/www/kheloindore/backend/public/site/build';

const vpsEnv = `PORT=3037
DATABASE_URL=mongodb://127.0.0.1:27017/KheloIndore
JWT_AUTH="KHELO_INDORE_JWT_SECRETKEY"

# PhonePe / Payment Settings
SALT_KEY="96434309-7796-489d-8924-ab56988a6076"
MERCHANT_ID="PGTESTPAYUAT86"
KEY_INDEX=1
PROD_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
REDIRECT_STATUS_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status"

REDIRECT_URL="qa.kheloindore.in/payment-success"
FAIL_URL="qa.kheloindore.in/payment-failed"
REDIRECT_API_URL="qa.kheloindore.in"

EMAIL_ID=swapinfotechindore@gmail.com
EMAIL_PASSWORD=ejnljjxnhcautboc
EMAIL_SERVICE=gmail
SUPER_ADMIN_EMAIL=iamsuperadmin@yopmail.com

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=no-reply@kheloindore.in
SMTP_PASS="Is#teK@9~"

# BhashSMS transactional SMS credentials
BHASH_SMS_API_URL=http://bhashsms.com/api/sendmsg.php
BHASH_SMS_USER=Surendra_SMS
BHASH_SMS_PASSWORD=123456
BHASH_SMS_SENDER_ID=KIMANS
BHASH_SMS_PRIORITY=ndnd
BHASH_SMS_TYPE=normal

BHASH_OTP_CHANNELS=sms,whatsapp
BHASH_WHATSAPP_API_URL=https://bhashsms.com/api/sendmsg.php
BHASH_WHATSAPP_SENDER_ID=BUZWAP
BHASH_WHATSAPP_OTP_TEMPLATE=kheloindore_otp
`;

function uploadDir(sftp, localDir, remoteDir) {
  return new Promise((resolve, reject) => {
    sftp.mkdir(remoteDir, (err) => {
      // Ignore if dir already exists
      const entries = fs.readdirSync(localDir);
      let count = entries.length;
      if (count === 0) return resolve();

      let completed = 0;
      for (const item of entries) {
        if (item === 'node_modules' || item === '.git' || item.endsWith('.log') || item.startsWith('test_')) {
          completed++;
          if (completed === count) resolve();
          continue;
        }

        const localPath = path.join(localDir, item);
        const remotePath = `${remoteDir}/${item}`;
        const stat = fs.statSync(localPath);

        if (stat.isDirectory()) {
          uploadDir(sftp, localPath, remotePath)
            .then(() => {
              completed++;
              if (completed === count) resolve();
            })
            .catch(reject);
        } else {
          sftp.fastPut(localPath, remotePath, (putErr) => {
            if (putErr) console.error(`Failed uploading ${localPath}:`, putErr.message);
            completed++;
            if (completed === count) resolve();
          });
        }
      }
    });
  });
}

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH connection established for deployment.');

  conn.sftp((err, sftp) => {
    if (err) throw err;

    console.log('--- Uploading Backend Files ---');
    uploadDir(sftp, localBackendDir, remoteBackendDir)
      .then(() => {
        console.log('Backend code uploaded.');
        console.log('--- Uploading Frontend Admin Build ---');
        return uploadDir(sftp, localAdminBuildDir, remoteAdminBuildDir);
      })
      .then(() => {
        console.log('Frontend Admin build uploaded.');
        console.log('--- Uploading Frontend Website Build ---');
        return uploadDir(sftp, localSiteBuildDir, remoteSiteBuildDir);
      })
      .then(() => {
        console.log('Frontend Website build uploaded.');
        
        // Write VPS .env
        const envStream = sftp.createWriteStream(`${remoteBackendDir}/.env`);
        envStream.write(vpsEnv);
        envStream.end();
        console.log('VPS .env file created with PORT=3037.');

        // Run post-deploy commands
        const cmds = [
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
            console.log(`Deployment script finished with exit code: ${code}`);
            conn.end();
          }).on('data', (d) => console.log(d.toString()))
            .stderr.on('data', (d) => console.error(d.toString()));
        });
      })
      .catch(e => {
        console.error('Upload error:', e);
        conn.end();
      });
  });
}).connect({
  host: '185.199.53.80',
  port: 22,
  username: 'root',
  password: 'OneHope@12345',
  readyTimeout: 30000
});
