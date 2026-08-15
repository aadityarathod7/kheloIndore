const { Client } = require('c:/Users/Dell/Downloads/kheloIndore-main (1)/kheloIndore-main/backend/node_modules/ssh2');

const conn = new Client();

const nginxConfig = `server {
    listen 80;
    server_name qa.kheloindore.in kheloindore.in www.kheloindore.in;

    client_max_body_size 50M;

    # API & backend routes -> Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3037;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Uploaded files -> Node.js
    location /uploads/ {
        proxy_pass http://127.0.0.1:3037;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # PDF files -> Node.js
    location /pdf/ {
        proxy_pass http://127.0.0.1:3037;
        proxy_set_header Host $host;
    }

    # Admin panel -> static build
    location /admin {
        alias /var/www/kheloindore/backend/public/admin/build;
        try_files $uri $uri/ /admin/index.html;

        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # Frontend website -> static build (catch-all for React Router)
    location / {
        root /var/www/kheloindore/backend/public/site/build;
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
}
`;

function executeCommands(commands) {
  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('SSH connection established to VPS.');
      
      // First update Nginx file
      conn.exec(`cat << 'EOF' > /etc/nginx/sites-available/kheloindore\n${nginxConfig}\nEOF\n`, (err, stream) => {
        if (err) return reject(err);
        
        stream.on('close', () => {
          console.log('Updated /etc/nginx/sites-available/kheloindore');
          
          // Now execute rest of commands
          const commandStr = commands.join(' && ');
          conn.exec(commandStr, (err2, stream2) => {
            if (err2) return reject(err2);
            
            let stdout = '';
            let stderr = '';

            stream2.on('close', (code, signal) => {
              console.log(`Commands finished with exit code: ${code}`);
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
  'nginx -t',
  'systemctl reload nginx',
  'echo "--- Attempting Certbot SSL Certificate Generation ---"',
  'certbot --nginx --non-interactive --agree-tos -m swapinfotechindore@gmail.com -d qa.kheloindore.in -d kheloindore.in -d www.kheloindore.in || certbot --nginx --non-interactive --agree-tos -m swapinfotechindore@gmail.com -d qa.kheloindore.in || true',
  'systemctl restart nginx',
  'pm2 restart all'
];

executeCommands(cmds)
  .then(() => console.log('VPS Nginx SSL Setup Complete.'))
  .catch(err => console.error('Error:', err));
