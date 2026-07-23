#!/bin/bash
# One-Click Deployment Script for DailyRashifalai.com

echo "=========================================================="
echo " 🕉️  Deploying VedaAstra AI to DailyRashifalai.com..."
echo "=========================================================="

# Update server packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git

# Setup directory
sudo mkdir -p /var/www/dailyrashifalai
sudo chown -R $USER:$USER /var/www/dailyrashifalai
cp -r . /var/www/dailyrashifalai/

cd /var/www/dailyrashifalai

# Setup virtual environment
python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install -r requirements.txt

# Setup systemd service
sudo cp vedastra.service /etc/systemd/system/vedastra.service
sudo systemctl daemon-reload
sudo systemctl enable vedastra
sudo systemctl restart vedastra

# Setup Nginx
sudo cp nginx.conf /etc/nginx/sites-available/dailyrashifalai
sudo ln -sf /etc/nginx/sites-available/dailyrashifalai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup Free SSL Certificate
sudo certbot --nginx -d dailyrashifalai.com -d www.dailyrashifalai.com --non-interactive --agree-tos -m admin@dailyrashifalai.com

echo "=========================================================="
echo " 🎉 DailyRashifalai.com is now LIVE with HTTPS SSL!"
echo "=========================================================="
