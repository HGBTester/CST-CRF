#!/bin/bash
 
# Quick fix for MongoDB installation on Ubuntu 24.04 (noble)
# This script fixes the MongoDB repository issue for Ubuntu 24.04
 
set -e
 
# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== MongoDB Fix for Ubuntu 24.04 ===${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root (use sudo)${NC}"
   exit 1
fi

# Remove old MongoDB repository list
echo -e "${YELLOW}Removing incorrect MongoDB repository...${NC}"
rm -f /etc/apt/sources.list.d/mongodb-org-7.0.list

# Add MongoDB GPG key
echo -e "${YELLOW}Adding MongoDB GPG key...${NC}"
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add correct repository (using Ubuntu 22.04 jammy repo for Ubuntu 24.04 noble)
echo -e "${YELLOW}Adding correct MongoDB repository (using Ubuntu 22.04 repo for compatibility)...${NC}"
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
echo -e "${YELLOW}Updating package list...${NC}"
apt-get update

# Install MongoDB
echo -e "${YELLOW}Installing MongoDB...${NC}"
apt-get install -y mongodb-org

# Hold MongoDB packages at current version
echo -e "${YELLOW}Holding MongoDB packages at current version...${NC}"
echo "mongodb-org hold" | dpkg --set-selections
echo "mongodb-org-database hold" | dpkg --set-selections
echo "mongodb-org-server hold" | dpkg --set-selections
echo "mongodb-mongosh hold" | dpkg --set-selections
echo "mongodb-org-mongos hold" | dpkg --set-selections
echo "mongodb-org-tools hold" | dpkg --set-selections

# Start and enable MongoDB
echo -e "${YELLOW}Starting MongoDB service...${NC}"
systemctl daemon-reload
systemctl start mongod
systemctl enable mongod

# Check status
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✓ MongoDB installed and running successfully!${NC}"
    mongod --version
else
    echo -e "${RED}MongoDB service failed to start. Check: sudo systemctl status mongod${NC}"
    exit 1
fi

echo -e "\n${GREEN}MongoDB fix completed!${NC}"
echo -e "${BLUE}You can now continue with the CST Audit installation.${NC}"
echo -e "${YELLOW}To verify MongoDB is working: mongosh --eval 'db.version()'${NC}"