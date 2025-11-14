#!/bin/bash
 
# CST Audit System - Complete Linux Deployment Script
# Supports: Ubuntu 20.04+, Debian 10+, CentOS 7+, RHEL 7+
# This script will install and configure the complete CST Audit system

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
INSTALL_DIR="/opt/cst-audit"
USER="cst-audit"
NODEJS_VERSION="18"
MONGODB_VERSION="7.0"
DOMAIN=""
USE_SSL="false"
MONGODB_URI=""
JWT_SECRET=""
ADMIN_PASSWORD=""

# Function to print colored output
print_message() {
    local COLOR=$1
    local MESSAGE=$2
    echo -e "${COLOR}${MESSAGE}${NC}"
}

# Function to detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        VER=$VERSION_ID
    else
        print_message "$RED" "Cannot detect OS version"
        exit 1
    fi
    print_message "$GREEN" "Detected OS: $OS $VER"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_message "$RED" "This script must be run as root"
        exit 1
    fi
}

# Function to gather installation parameters
gather_parameters() {
    print_message "$BLUE" "\n=== CST Audit System Installation ==="

    read -p "Installation directory [$INSTALL_DIR]: " input_dir
    INSTALL_DIR=${input_dir:-$INSTALL_DIR}

    read -p "System user to create [$USER]: " input_user
    USER=${input_user:-$USER}

    read -p "Domain name (leave empty for IP-based access): " DOMAIN

    if [ ! -z "$DOMAIN" ]; then
        read -p "Enable SSL/HTTPS? (y/n) [n]: " ssl_input
        if [[ $ssl_input == "y" || $ssl_input == "Y" ]]; then
            USE_SSL="true"
        fi
    fi

    read -p "MongoDB URI (leave empty to install local MongoDB): " MONGODB_URI

    # Generate random JWT secret if not provided
    JWT_SECRET=$(openssl rand -base64 32)
    read -p "JWT Secret (press enter to use generated): " input_jwt
    JWT_SECRET=${input_jwt:-$JWT_SECRET}

    read -p "Admin password [admin123]: " ADMIN_PASSWORD
    ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}

    print_message "$GREEN" "\nConfiguration Summary:"
    echo "Install Directory: $INSTALL_DIR"
    echo "System User: $USER"
    echo "Domain: ${DOMAIN:-Not configured}"
    echo "SSL: $USE_SSL"
    echo "MongoDB: ${MONGODB_URI:-Local installation}"
    echo ""
    read -p "Continue with installation? (y/n): " confirm
    if [[ $confirm != "y" && $confirm != "Y" ]]; then
        print_message "$YELLOW" "Installation cancelled"
        exit 0
    fi
}

# Function to install Node.js
install_nodejs() {
    print_message "$BLUE" "\n=== Installing Node.js $NODEJS_VERSION ==="

    if command -v node &> /dev/null; then
        print_message "$YELLOW" "Node.js already installed: $(node -v)"
        return
    fi

    case $OS in
        ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_${NODEJS_VERSION}.x | bash -
            apt-get install -y nodejs build-essential
            ;;
        centos|rhel|fedora)
            curl -fsSL https://rpm.nodesource.com/setup_${NODEJS_VERSION}.x | bash -
            yum install -y nodejs gcc-c++ make
            ;;
        *)
            print_message "$RED" "Unsupported OS for Node.js installation"
            exit 1
            ;;
    esac

    print_message "$GREEN" "Node.js installed: $(node -v)"
}

# Function to install MongoDB
install_mongodb() {
    if [ ! -z "$MONGODB_URI" ]; then
        print_message "$YELLOW" "Using external MongoDB"
        return
    fi

    print_message "$BLUE" "\n=== Installing MongoDB $MONGODB_VERSION ==="

    if command -v mongod &> /dev/null; then
        print_message "$YELLOW" "MongoDB already installed"
        return
    fi

    case $OS in
        ubuntu|debian)
            # Install MongoDB
            curl -fsSL https://pgp.mongodb.com/server-${MONGODB_VERSION}.asc | \
                gpg -o /usr/share/keyrings/mongodb-server-${MONGODB_VERSION}.gpg --dearmor

            # Detect Ubuntu version and use appropriate repository
            UBUNTU_VERSION=$(lsb_release -cs)

            # MongoDB 7.0 doesn't support Ubuntu 24.04 (noble) yet, use 22.04 (jammy) repository
            if [ "$UBUNTU_VERSION" = "noble" ]; then
                print_message "$YELLOW" "Ubuntu 24.04 detected. Using Ubuntu 22.04 repository for MongoDB compatibility."
                REPO_VERSION="jammy"
            else
                REPO_VERSION="$UBUNTU_VERSION"
            fi

            echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-${MONGODB_VERSION}.gpg ] \
                https://repo.mongodb.org/apt/$OS $REPO_VERSION/mongodb-org/${MONGODB_VERSION} multiverse" | \
                tee /etc/apt/sources.list.d/mongodb-org-${MONGODB_VERSION}.list

            apt-get update
            apt-get install -y mongodb-org

            # Start and enable MongoDB
            systemctl start mongod
            systemctl enable mongod
            ;;
        centos|rhel|fedora)
            # Create MongoDB repo file
            cat > /etc/yum.repos.d/mongodb-org-${MONGODB_VERSION}.repo <<EOF
[mongodb-org-${MONGODB_VERSION}]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/${MONGODB_VERSION}/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-${MONGODB_VERSION}.asc
EOF

            yum install -y mongodb-org

            # Start and enable MongoDB
            systemctl start mongod
            systemctl enable mongod
            ;;
        *)
            print_message "$RED" "Unsupported OS for MongoDB installation"
            exit 1
            ;;
    esac

    # Set local MongoDB URI
    MONGODB_URI="mongodb://localhost:27017/cst-audit"
    print_message "$GREEN" "MongoDB installed and running"
}

# Function to install nginx
install_nginx() {
    if [ -z "$DOMAIN" ]; then
        print_message "$YELLOW" "Skipping nginx installation (no domain configured)"
        return
    fi

    print_message "$BLUE" "\n=== Installing Nginx ==="

    case $OS in
        ubuntu|debian)
            apt-get install -y nginx certbot python3-certbot-nginx
            ;;
        centos|rhel|fedora)
            yum install -y nginx certbot python3-certbot-nginx
            ;;
    esac

    systemctl start nginx
    systemctl enable nginx

    print_message "$GREEN" "Nginx installed"
}

# Function to install Git
install_git() {
    print_message "$BLUE" "\n=== Installing Git ==="

    if command -v git &> /dev/null; then
        print_message "$YELLOW" "Git already installed"
        return
    fi

    case $OS in
        ubuntu|debian)
            apt-get install -y git
            ;;
        centos|rhel|fedora)
            yum install -y git
            ;;
    esac

    print_message "$GREEN" "Git installed"
}

# Function to install PM2
install_pm2() {
    print_message "$BLUE" "\n=== Installing PM2 Process Manager ==="

    if command -v pm2 &> /dev/null; then
        print_message "$YELLOW" "PM2 already installed"
        return
    fi

    npm install -g pm2
    print_message "$GREEN" "PM2 installed"
}

# Function to create system user
create_user() {
    print_message "$BLUE" "\n=== Creating system user: $USER ==="

    if id "$USER" &>/dev/null; then
        print_message "$YELLOW" "User $USER already exists"
    else
        useradd -r -m -d /home/$USER -s /bin/bash $USER
        print_message "$GREEN" "User $USER created"
    fi
}

# Function to clone repository
clone_repository() {
    print_message "$BLUE" "\n=== Cloning CST Audit repository ==="

    if [ -d "$INSTALL_DIR" ]; then
        print_message "$YELLOW" "Directory $INSTALL_DIR already exists"
        read -p "Remove existing directory and continue? (y/n): " remove_dir
        if [[ $remove_dir == "y" || $remove_dir == "Y" ]]; then
            rm -rf $INSTALL_DIR
        else
            print_message "$RED" "Installation aborted"
            exit 1
        fi
    fi

    mkdir -p $INSTALL_DIR
    cd $INSTALL_DIR

    # Clone repository
    git clone https://github.com/HGBTester/CST-CRF.git .

    # Set ownership
    chown -R $USER:$USER $INSTALL_DIR

    print_message "$GREEN" "Repository cloned to $INSTALL_DIR"
}

# Function to install dependencies
install_dependencies() {
    print_message "$BLUE" "\n=== Installing Node.js dependencies ==="

    cd $INSTALL_DIR

    # Install frontend dependencies
    print_message "$YELLOW" "Installing frontend dependencies..."
    sudo -u $USER npm install

    # Install backend dependencies
    print_message "$YELLOW" "Installing backend dependencies..."
    cd backend
    sudo -u $USER npm install
    cd ..

    print_message "$GREEN" "Dependencies installed"
}

# Function to setup environment
setup_environment() {
    print_message "$BLUE" "\n=== Setting up environment ==="

    # Create backend .env file
    cat > $INSTALL_DIR/backend/.env <<EOF
PORT=5000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
EOF

    # Create frontend .env file
    if [ ! -z "$DOMAIN" ]; then
        if [ "$USE_SSL" == "true" ]; then
            API_URL="https://$DOMAIN/api"
        else
            API_URL="http://$DOMAIN/api"
        fi
    else
        API_URL="http://localhost:5000/api"
    fi

    cat > $INSTALL_DIR/.env <<EOF
VITE_API_URL=$API_URL
EOF

    # Set ownership
    chown $USER:$USER $INSTALL_DIR/.env
    chown $USER:$USER $INSTALL_DIR/backend/.env
    chmod 600 $INSTALL_DIR/backend/.env

    print_message "$GREEN" "Environment configured"
}

# Function to build frontend
build_frontend() {
    print_message "$BLUE" "\n=== Building frontend ==="

    cd $INSTALL_DIR
    sudo -u $USER npm run build

    print_message "$GREEN" "Frontend built successfully"
}

# Function to initialize database
initialize_database() {
    print_message "$BLUE" "\n=== Initializing database ==="

    # Create initialization script
    cat > $INSTALL_DIR/backend/init-db.js <<'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const AuditStructure = require('./models/AuditStructure');
const FormTypeDefinition = require('./models/FormTypeDefinition');
const EvidenceMapping = require('./models/EvidenceMapping');
const EvidenceRequirement = require('./models/EvidenceRequirement');
const TemplateContent = require('./models/TemplateContent');

const auditStructureData = require('./scripts/data/auditStructureData');
const formTypeDefinitionsData = require('./scripts/data/formTypeDefinitionsData');
const evidenceMappingData = require('./scripts/data/evidenceMappingData');
const evidenceRequirementsData = require('./scripts/data/evidenceRequirementsData');
const templateContentsData = require('./scripts/data/templateContentsData');

require('dotenv').config();

async function initializeDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                email: 'admin@cst-audit.local'
            });
            console.log('Admin user created');
        }

        // Initialize audit structure
        const auditExists = await AuditStructure.findOne();
        if (!auditExists) {
            await AuditStructure.insertMany(auditStructureData);
            console.log('Audit structure initialized');
        }

        // Initialize form types
        const formsExist = await FormTypeDefinition.findOne();
        if (!formsExist) {
            await FormTypeDefinition.insertMany(formTypeDefinitionsData);
            console.log('Form type definitions initialized');
        }

        // Initialize evidence mappings
        const mappingsExist = await EvidenceMapping.findOne();
        if (!mappingsExist) {
            await EvidenceMapping.insertMany(evidenceMappingData);
            console.log('Evidence mappings initialized');
        }

        // Initialize evidence requirements
        const requirementsExist = await EvidenceRequirement.findOne();
        if (!requirementsExist) {
            await EvidenceRequirement.insertMany(evidenceRequirementsData);
            console.log('Evidence requirements initialized');
        }

        // Initialize template contents
        const templatesExist = await TemplateContent.findOne();
        if (!templatesExist) {
            await TemplateContent.insertMany(templateContentsData);
            console.log('Template contents initialized');
        }

        console.log('Database initialization complete');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDatabase();
EOF

    # Add admin password to backend .env
    echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" >> $INSTALL_DIR/backend/.env

    # Run initialization
    cd $INSTALL_DIR/backend
    sudo -u $USER node init-db.js

    # Remove admin password from .env after initialization
    sed -i '/ADMIN_PASSWORD=/d' $INSTALL_DIR/backend/.env

    print_message "$GREEN" "Database initialized"
}

# Function to setup PM2
setup_pm2() {
    print_message "$BLUE" "\n=== Setting up PM2 process manager ==="

    # Create PM2 ecosystem file
    cat > $INSTALL_DIR/ecosystem.config.js <<EOF
module.exports = {
  apps: [
    {
      name: 'cst-audit-backend',
      script: './backend/server.js',
      cwd: '$INSTALL_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '$INSTALL_DIR/logs/backend-error.log',
      out_file: '$INSTALL_DIR/logs/backend-out.log',
      log_file: '$INSTALL_DIR/logs/backend-combined.log',
      time: true
    },
    {
      name: 'cst-audit-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      cwd: '$INSTALL_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '$INSTALL_DIR/logs/frontend-error.log',
      out_file: '$INSTALL_DIR/logs/frontend-out.log',
      log_file: '$INSTALL_DIR/logs/frontend-combined.log',
      time: true
    }
  ]
};
EOF

    # Create logs directory
    mkdir -p $INSTALL_DIR/logs
    chown -R $USER:$USER $INSTALL_DIR/logs

    # Install serve for frontend
    cd $INSTALL_DIR
    sudo -u $USER npm install --save serve

    # Start applications with PM2
    sudo -u $USER pm2 start ecosystem.config.js
    sudo -u $USER pm2 save

    # Setup PM2 startup script
    pm2 startup systemd -u $USER --hp /home/$USER

    print_message "$GREEN" "PM2 configured and applications started"
}

# Function to setup nginx
setup_nginx() {
    if [ -z "$DOMAIN" ]; then
        print_message "$YELLOW" "Skipping nginx setup (no domain configured)"
        return
    fi

    print_message "$BLUE" "\n=== Setting up Nginx ==="

    # Create nginx configuration
    cat > /etc/nginx/sites-available/cst-audit <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # File uploads
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    client_max_body_size 100M;
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/cst-audit /etc/nginx/sites-enabled/

    # Test nginx configuration
    nginx -t

    # Reload nginx
    systemctl reload nginx

    # Setup SSL if requested
    if [ "$USE_SSL" == "true" ]; then
        print_message "$YELLOW" "Setting up SSL certificate..."
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
    fi

    print_message "$GREEN" "Nginx configured"
}

# Function to setup firewall
setup_firewall() {
    print_message "$BLUE" "\n=== Setting up firewall ==="

    case $OS in
        ubuntu|debian)
            # Install ufw if not installed
            which ufw > /dev/null 2>&1 || apt-get install -y ufw

            ufw allow 22/tcp  # SSH
            ufw allow 80/tcp  # HTTP
            ufw allow 443/tcp # HTTPS

            # Allow local connections only for MongoDB and Node.js
            ufw allow from 127.0.0.1 to any port 27017
            ufw allow from 127.0.0.1 to any port 5000
            ufw allow from 127.0.0.1 to any port 3000

            ufw --force enable
            print_message "$GREEN" "UFW firewall configured"
            ;;
        centos|rhel|fedora)
            # Configure firewalld
            systemctl start firewalld
            systemctl enable firewalld

            firewall-cmd --permanent --add-service=ssh
            firewall-cmd --permanent --add-service=http
            firewall-cmd --permanent --add-service=https
            firewall-cmd --reload

            print_message "$GREEN" "Firewalld configured"
            ;;
    esac
}

# Function to create backup script
create_backup_script() {
    print_message "$BLUE" "\n=== Creating backup script ==="

    mkdir -p /opt/cst-audit-backups

    cat > /usr/local/bin/cst-audit-backup.sh <<'EOF'
#!/bin/bash

# CST Audit Backup Script
BACKUP_DIR="/opt/cst-audit-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="cst-audit-backup-$TIMESTAMP"

# Create backup directory
mkdir -p $BACKUP_DIR/$BACKUP_NAME

# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/cst-audit" --out=$BACKUP_DIR/$BACKUP_NAME/mongodb

# Backup application files
tar -czf $BACKUP_DIR/$BACKUP_NAME/app-files.tar.gz -C /opt/cst-audit uploads backend/.env .env

# Create final archive
cd $BACKUP_DIR
tar -czf $BACKUP_NAME.tar.gz $BACKUP_NAME
rm -rf $BACKUP_NAME

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
EOF

    chmod +x /usr/local/bin/cst-audit-backup.sh

    # Add to crontab for daily backups at 2 AM
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/cst-audit-backup.sh") | crontab -

    print_message "$GREEN" "Backup script created and scheduled"
}

# Function to display final information
display_final_info() {
    print_message "$GREEN" "\n========================================="
    print_message "$GREEN" "CST Audit System Installation Complete!"
    print_message "$GREEN" "========================================="

    echo ""
    print_message "$BLUE" "Access Information:"
    if [ ! -z "$DOMAIN" ]; then
        if [ "$USE_SSL" == "true" ]; then
            echo "URL: https://$DOMAIN"
        else
            echo "URL: http://$DOMAIN"
        fi
    else
        echo "URL: http://<server-ip>:3000"
        echo "API: http://<server-ip>:5000"
    fi
    echo ""
    print_message "$BLUE" "Login Credentials:"
    echo "Username: admin"
    echo "Password: $ADMIN_PASSWORD"
    echo ""
    print_message "$BLUE" "Useful Commands:"
    echo "View logs: sudo -u $USER pm2 logs"
    echo "Monitor apps: sudo -u $USER pm2 monit"
    echo "Restart apps: sudo -u $USER pm2 restart all"
    echo "Stop apps: sudo -u $USER pm2 stop all"
    echo "Backup now: /usr/local/bin/cst-audit-backup.sh"
    echo ""
    print_message "$BLUE" "File Locations:"
    echo "Application: $INSTALL_DIR"
    echo "Logs: $INSTALL_DIR/logs"
    echo "Backups: /opt/cst-audit-backups"
    echo "Uploads: $INSTALL_DIR/uploads"
    echo ""
    print_message "$YELLOW" "Important: Save the admin password in a secure location!"
}

# Main installation flow
main() {
    print_message "$BLUE" "CST Audit System - Linux Deployment Script"
    print_message "$BLUE" "==========================================="

    check_root
    detect_os
    gather_parameters

    # Update system
    print_message "$BLUE" "\n=== Updating system packages ==="
    case $OS in
        ubuntu|debian)
            apt-get update
            apt-get upgrade -y
            ;;
        centos|rhel|fedora)
            yum update -y
            ;;
    esac

    # Install dependencies
    install_nodejs
    install_mongodb
    install_nginx
    install_git
    install_pm2

    # Setup application
    create_user
    clone_repository
    install_dependencies
    setup_environment
    build_frontend
    initialize_database

    # Configure services
    setup_pm2
    setup_nginx
    setup_firewall
    create_backup_script

    # Display final information
    display_final_info
}

# Run main function
main "$@"