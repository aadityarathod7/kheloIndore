const { Client } = require('c:/Users/Dell/Downloads/kheloIndore-main (1)/kheloIndore-main/backend/node_modules/ssh2');

const conn = new Client();

const scriptContent = `
const fs = require("fs");
const path = "/root/.pm2/logs/kheloindore-api-out.log";
const errPath = "/root/.pm2/logs/kheloindore-api-error.log";

function parseLog(p) {
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, "utf8").split("\\n");
    console.log("=== Last 50 lines of " + p + " ===");
    console.log(lines.slice(-50).join("\\n"));
  }
}

parseLog(path);
parseLog(errPath);
`;

conn.on('ready', () => {
  console.log('SSH connection ready. Checking logs...');
  conn.exec(`cat << 'EOF' > /tmp/check_roles.js\n${scriptContent}\nEOF\nnode /tmp/check_roles.js`, (err, stream) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    stream.on('close', (code) => {
      conn.end();
      process.exit(code);
    }).on('data', (data) => {
      console.log(data.toString());
    }).stderr.on('data', (data) => {
      console.error(data.toString());
    });
  });
}).on('error', (err) => {
  console.error(err);
  process.exit(1);
}).connect({
  host: '185.199.53.80',
  port: 22,
  username: 'root',
  password: 'OneHope@12345'
});
