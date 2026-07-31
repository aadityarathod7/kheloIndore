#!/bin/bash
set -e

echo "============================================"
echo "  Khelo Indore VPS Setup - qa.kheloindore.in"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# ==========================================
# 1. System Update
# ==========================================
print_step "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ==========================================
# 2. Install Node.js 20 LTS
# ==========================================
if ! command -v node &> /dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]]; then
    print_step "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    print_warn "Node.js $(node -v) already installed, skipping..."
fi
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# ==========================================
# 3. Install MongoDB 7.0
# ==========================================
if ! command -v mongod &> /dev/null; then
    print_step "Installing MongoDB 7.0..."
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg 2>/dev/null || true
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt update
    sudo apt install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
else
    print_warn "MongoDB already installed, skipping..."
    sudo systemctl start mongod 2>/dev/null || true
fi

# ==========================================
# 4. Install Nginx
# ==========================================
if ! command -v nginx &> /dev/null; then
    print_step "Installing Nginx..."
    sudo apt install -y nginx
else
    print_warn "Nginx already installed, skipping..."
fi

# ==========================================
# 5. Install PM2
# ==========================================
if ! command -v pm2 &> /dev/null; then
    print_step "Installing PM2..."
    sudo npm install -g pm2
else
    print_warn "PM2 already installed, skipping..."
fi

# ==========================================
# 6. Install Certbot
# ==========================================
if ! command -v certbot &> /dev/null; then
    print_step "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
else
    print_warn "Certbot already installed, skipping..."
fi

# ==========================================
# 7. Create app directory
# ==========================================
print_step "Creating application directory..."
sudo mkdir -p /var/www/kheloindore
sudo chown -R $USER:$USER /var/www/kheloindore

# ==========================================
# 8. Setup backend
# ==========================================
print_step "Setting up backend..."
cd /var/www/kheloindore/backend
npm install --production

# ==========================================
# 9. Copy builds to backend public directory
# ==========================================
print_step "Copying frontend builds..."
mkdir -p /var/www/kheloindore/backend/public/site/build
mkdir -p /var/www/kheloindore/backend/public/admin/build
mkdir -p /var/www/kheloindore/backend/public/uploads

# If site-build and admin-build directories exist at /var/www/kheloindore/
if [ -d "/var/www/kheloindore/site-build" ]; then
    cp -r /var/www/kheloindore/site-build/* /var/www/kheloindore/backend/public/site/build/
    print_step "Frontend website build copied."
fi

if [ -d "/var/www/kheloindore/admin-build" ]; then
    cp -r /var/www/kheloindore/admin-build/* /var/www/kheloindore/backend/public/admin/build/
    print_step "Admin panel build copied."
fi

# ==========================================
# 10. Start backend with PM2
# ==========================================
print_step "Starting backend with PM2..."
cd /var/www/kheloindore/backend
pm2 delete kheloindore-api 2>/dev/null || true
pm2 start index.js --name "kheloindore-api"
pm2 save

# Enable PM2 startup on reboot
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

# ==========================================
# 11. Configure Nginx
# ==========================================
print_step "Configuring Nginx..."
sudo cp /var/www/kheloindore/deploy/nginx/kheloindore.conf /etc/nginx/sites-available/kheloindore
sudo ln -sf /etc/nginx/sites-available/kheloindore /etc/nginx/sites-enabled/kheloindore
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t
sudo systemctl reload nginx

# ==========================================
# 12. SSL Certificate
# ==========================================
print_step "Setting up SSL with Let's Encrypt..."
echo ""
print_warn "Running certbot for qa.kheloindore.in..."
print_warn "Make sure DNS A record is pointing to this server's IP!"
echo ""
sudo certbot --nginx -d qa.kheloindore.in --non-interactive --agree-tos --email admin@kheloindore.in --redirect || {
    print_warn "Certbot failed. You can run it manually later:"
    echo "  sudo certbot --nginx -d qa.kheloindore.in"
}

# ==========================================
# 13. Open firewall ports
# ==========================================
print_step "Configuring firewall..."
sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow OpenSSH 2>/dev/null || true

# ==========================================
# Done!
# ==========================================
echo ""
echo "============================================"
echo -e "${GREEN}  DEPLOYMENT COMPLETE!${NC}"
echo "============================================"
echo ""
echo "  Website:  https://qa.kheloindore.in"
echo "  Admin:    https://qa.kheloindore.in/admin"
echo "  API:      https://qa.kheloindore.in/api"
echo ""
echo "  PM2 Status: pm2 status"
echo "  PM2 Logs:   pm2 logs kheloindore-api"
echo "  Nginx Logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "  To seed the database:"
echo "  cd /var/www/kheloindore/backend && node seed_excel_all_tabs.js"
echo ""
