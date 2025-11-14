# CST Audit System - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [System Requirements](#system-requirements)
3. [Quick Deployment](#quick-deployment)
4. [Manual Installation](#manual-installation)
5. [Configuration](#configuration)
6. [SSL/HTTPS Setup](#sslhttps-setup)
7. [Backup and Recovery](#backup-and-recovery)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)
10. [Security Checklist](#security-checklist)

---

## Overview

The CST Audit System is a comprehensive compliance management platform for CST L3 Company Certification. This guide provides detailed instructions for deploying the system on Linux servers.

### Deployment Options

1. **Automated Deployment** - Use the provided `deploy.sh` script for quick setup
2. **Manual Installation** - Step-by-step manual configuration
3. **Docker Deployment** - Container-based deployment (coming soon)
4. **Cloud Deployment** - Deploy to Railway, Render, or AWS

---

## System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+, Debian 10+, CentOS 7+, or RHEL 7+
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB free space
- **Network**: Static IP or domain name

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: Domain with SSL certificate

### Software Prerequisites
- Node.js 18.x or higher
- MongoDB 7.0 or higher
- Nginx (for reverse proxy)
- Git
- PM2 or systemd (process manager)

---

## Quick Deployment

### One-Command Installation

```bash
# Download and run the deployment script
wget https://raw.githubusercontent.com/HGBTester/CST-CRF/main/deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
1. Install all dependencies (Node.js, MongoDB, Nginx)
2. Clone the repository
3. Configure the application
4. Set up services
5. Initialize the database
6. Start the application

### Post-Installation

After successful installation:
- Access the application at `http://your-domain.com` or `http://server-ip:3000`
- Login with default credentials:
  - Username: `admin`
  - Password: `admin123` (change immediately!)

---

## Manual Installation

### Step 1: System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
# OR
sudo yum update -y  # CentOS/RHEL

# Install essential tools
sudo apt install -y curl wget git build-essential  # Ubuntu/Debian
# OR
sudo yum install -y curl wget git gcc-c++ make  # CentOS/RHEL
```

### Step 2: Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs  # Ubuntu/Debian

# OR for CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node -v  # Should show v18.x.x
npm -v   # Should show 9.x.x or higher
```

### Step 3: Install MongoDB

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Step 4: Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/cst-audit
cd /opt

# Clone the repository
sudo git clone https://github.com/HGBTester/CST-CRF.git cst-audit
cd cst-audit

# Create system user
sudo useradd -r -m -d /home/cst-audit -s /bin/bash cst-audit
sudo chown -R cst-audit:cst-audit /opt/cst-audit
```

### Step 5: Install Dependencies

```bash
# Switch to application user
sudo -u cst-audit bash

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 6: Configure Environment

```bash
# Run environment setup script
chmod +x deploy/setup-env.sh
./deploy/setup-env.sh

# OR manually create .env files:

# Backend configuration
cat > backend/.env <<EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cst-audit
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
EOF

# Frontend configuration
cat > .env <<EOF
VITE_API_URL=http://localhost:5000/api
EOF
```

### Step 7: Initialize Database

```bash
# Run database initialization
cd backend
node ../deploy/init-database.js

# OR use the script in backend folder
node scripts/init-db.js
```

### Step 8: Build Frontend

```bash
# Build production frontend
cd /opt/cst-audit
npm run build
```

### Step 9: Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js <<'EOF'
module.exports = {
  apps: [
    {
      name: 'cst-backend',
      script: './backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'cst-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
EOF

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u cst-audit --hp /home/cst-audit
```

### Step 10: Configure Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Copy nginx configuration
sudo cp deploy/nginx-cst-audit.conf /etc/nginx/sites-available/cst-audit

# Update domain in configuration
sudo sed -i 's/your-domain.com/YOUR_ACTUAL_DOMAIN/g' /etc/nginx/sites-available/cst-audit

# Enable site
sudo ln -s /etc/nginx/sites-available/cst-audit /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/cst-audit

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=50MB
UPLOAD_DIR=./uploads
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CST Audit System
```

### Database Configuration

For MongoDB authentication:
```javascript
// In backend/.env
MONGODB_URI=mongodb://username:password@localhost:27017/cst-audit?authSource=admin
```

For MongoDB Atlas (cloud):
```javascript
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cst-audit?retryWrites=true&w=majority
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already set up by certbot)
sudo systemctl status snap.certbot.renew.timer
```

### Manual SSL Configuration

1. Place your SSL certificates in `/etc/ssl/certs/`
2. Update Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    # ... rest of configuration
}
```

---

## Backup and Recovery

### Automated Backups

The deployment script creates `/usr/local/bin/cst-audit-backup.sh`:

```bash
# Run backup manually
sudo /usr/local/bin/cst-audit-backup.sh

# View cron schedule
crontab -l

# Backups are stored in
/opt/cst-audit-backups/
```

### Manual Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/cst-audit" --out=./backup

# Backup application files
tar -czf cst-audit-files.tar.gz uploads/ backend/.env .env

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/cst-audit" ./backup/cst-audit
```

---

## Monitoring

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit
pm2 logs
pm2 status

# View specific logs
pm2 logs cst-backend
pm2 logs cst-frontend
```

### System Monitoring

```bash
# Check service status
systemctl status mongod
systemctl status nginx
systemctl status pm2-cst-audit

# Check resource usage
htop
df -h
free -m
```

### Log Files

- Application logs: `/opt/cst-audit/logs/`
- Nginx logs: `/var/log/nginx/`
- MongoDB logs: `/var/log/mongodb/`
- PM2 logs: `~/.pm2/logs/`

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

#### MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### Permission Denied Errors
```bash
# Fix ownership
sudo chown -R cst-audit:cst-audit /opt/cst-audit

# Fix permissions
sudo chmod -R 755 /opt/cst-audit
sudo chmod -R 777 /opt/cst-audit/uploads
```

#### Nginx 502 Bad Gateway
```bash
# Check if backend is running
pm2 status

# Restart services
pm2 restart all

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

### Debug Mode

Enable debug logging:
```javascript
// In backend/.env
LOG_LEVEL=debug
NODE_ENV=development
```

---

## Security Checklist

### Essential Security Steps

- [ ] Change default admin password immediately
- [ ] Configure firewall rules
- [ ] Enable SSL/HTTPS
- [ ] Set up regular backups
- [ ] Update JWT_SECRET in production
- [ ] Restrict MongoDB access to localhost
- [ ] Configure Nginx rate limiting
- [ ] Set up fail2ban for SSH
- [ ] Regular security updates
- [ ] Monitor application logs

### Firewall Configuration

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### MongoDB Security

```javascript
// Create database user
use cst-audit
db.createUser({
  user: "cstaudit",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "cst-audit" }]
})

// Enable authentication in /etc/mongod.conf
security:
  authorization: enabled
```

---

## Support and Resources

### Getting Help

- **GitHub Issues**: [https://github.com/HGBTester/CST-CRF/issues](https://github.com/HGBTester/CST-CRF/issues)
- **Documentation**: Check the `/docs` folder
- **Logs**: Always check logs first when troubleshooting

### Useful Commands Reference

```bash
# Service Management
pm2 status                 # Check app status
pm2 restart all            # Restart all apps
pm2 logs                   # View logs
pm2 monit                  # Real-time monitoring

# Database
mongosh                    # MongoDB shell
mongodump                  # Backup database
mongorestore               # Restore database

# System
htop                       # System resources
df -h                      # Disk usage
free -m                    # Memory usage
netstat -tlnp              # Network connections
journalctl -u service      # Service logs
```

### Update Procedure

```bash
# Backup first!
/usr/local/bin/cst-audit-backup.sh

# Pull latest changes
cd /opt/cst-audit
git pull origin main

# Install new dependencies
npm install
cd backend && npm install

# Rebuild frontend
npm run build

# Restart services
pm2 restart all
```

---

## License

Copyright (c) 2024 CST Audit System. All rights reserved.