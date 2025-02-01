#!/bin/bash

# Exit on any error
set -e

# Load environment variables
source ~/.bashrc

# Log file
LOG_FILE="/home/ubuntu/deploy.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to handle errors
handle_error() {
    log_message "Error occurred in deployment. Rolling back..."
    # Restore from backup
    if [ -d "/home/ubuntu/backup" ]; then
        rm -rf /home/ubuntu/Brilldaddy/*
        cp -r /home/ubuntu/backup/* /home/ubuntu/Brilldaddy/
        log_message "Rollback completed"
    fi
    
    # Restart services with previous version
    pm2 restart all
    sudo systemctl restart nginx
    
    exit 1
}

# Set error handler
trap 'handle_error' ERR

# Create backup of current version
log_message "Creating backup..."
rm -rf /home/ubuntu/backup
mkdir -p /home/ubuntu/backup
cp -r /home/ubuntu/Brilldaddy/* /home/ubuntu/backup/

# Navigate to project directory
cd /home/ubuntu/Brilldaddy

# Pull latest changes
log_message "Pulling latest changes..."
git pull origin main

# Install backend dependencies
log_message "Installing backend dependencies..."
cd Backend
npm install

# Test backend
log_message "Testing backend..."
if ! node -e "require('./app.js')"; then
    log_message "Backend test failed"
    exit 1
fi

# Install and build frontend
log_message "Building frontend..."
cd ../frontend
npm install
npm run build

# Test if build directory exists
if [ ! -d "dist" ]; then
    log_message "Frontend build failed"
    exit 1
fi

# Restart services
log_message "Restarting services..."
pm2 restart all
sudo systemctl restart nginx

log_message "Deployment completed successfully"