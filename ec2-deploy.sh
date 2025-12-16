#!/bin/bash

echo "=========================================="
echo "  Employee Management System - EC2 Setup"
echo "=========================================="

# Update system
echo "📦 Updating system..."
sudo yum update -y

# Install Java 17
echo "☕ Installing Java 17..."
sudo yum install java-17-amazon-corretto -y

# Install Maven
echo "📦 Installing Maven..."
sudo yum install maven -y

# Install Node.js
echo "📦 Installing Node.js..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y

# Install Nginx
echo "📦 Installing Nginx..."
sudo yum install nginx -y

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Build Backend
echo "🔧 Building Backend..."
cd backend
mvn clean package -DskipTests
cd ..

# Build Frontend
echo "🎨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Setup Nginx
echo "🌐 Configuring Nginx..."
sudo mkdir -p /var/www/html
sudo rm -rf /var/www/html/*
sudo cp -r frontend/dist/employee-management/browser/* /var/www/html/ 2>/dev/null || sudo cp -r frontend/dist/employee-management/* /var/www/html/
sudo chmod -R 755 /var/www/html
sudo chown -R nginx:nginx /var/www/html

# Create Nginx config
sudo tee /etc/nginx/conf.d/employee.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Remove default config
sudo rm -f /etc/nginx/conf.d/default.conf
sudo rm -f /etc/nginx/sites-enabled/default

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

# Create systemd service for backend
echo "⚙️ Creating backend service..."
sudo tee /etc/systemd/system/employee-app.service > /dev/null << EOF
[Unit]
Description=Employee Management App
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=$SCRIPT_DIR/backend
ExecStart=/usr/bin/java -jar $SCRIPT_DIR/backend/target/management-1.0.0.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Start backend service
sudo systemctl daemon-reload
sudo systemctl start employee-app
sudo systemctl enable employee-app

echo ""
echo "=========================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "Backend:  http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8080"
echo ""
echo "Commands:"
echo "  Check backend:  sudo systemctl status employee-app"
echo "  Check nginx:    sudo systemctl status nginx"
echo "  View logs:      sudo journalctl -u employee-app -f"
echo ""

