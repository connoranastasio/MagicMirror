#!/bin/bash
# MagicMirror Deployment Script
# Deploys changes from desktop to Raspberry Pi

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PI_USER="pi"
PI_HOST="magicmirror.local"
PI_PATH="~/MagicMirror"
BRANCH="main"

echo -e "${GREEN}=== MagicMirror Deployment Script ===${NC}\n"

# Check if commit message provided
COMMIT_MSG="${1:-Update configuration}"

# Step 1: Check git status
echo -e "${YELLOW}Step 1: Checking git status...${NC}"
if [[ -n $(git status -s) ]]; then
    echo "Changes detected. Proceeding with commit..."
else
    echo "No changes detected. Checking if push is needed..."
    if [[ $(git rev-parse HEAD) == $(git rev-parse @{u}) ]]; then
        echo -e "${GREEN}Already up to date. Deploying current version to Pi...${NC}\n"
    fi
fi

# Step 2: Add, commit, and push changes
if [[ -n $(git status -s) ]]; then
    echo -e "\n${YELLOW}Step 2: Committing changes...${NC}"
    git add .
    git commit -m "$COMMIT_MSG"

    echo -e "\n${YELLOW}Step 3: Pushing to GitHub...${NC}"
    git push origin $BRANCH
else
    echo -e "\n${YELLOW}Step 2-3: No new changes to commit${NC}"
fi

# Step 4: Deploy to Raspberry Pi
echo -e "\n${YELLOW}Step 4: Deploying to Raspberry Pi...${NC}"
echo "Connecting to $PI_USER@$PI_HOST..."

ssh $PI_USER@$PI_HOST << 'ENDSSH'
set -e

# Color codes for remote
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}On Raspberry Pi:${NC}"

cd ~/MagicMirror

echo "  - Pulling latest changes from git..."
git pull origin main

echo "  - Checking for dependency updates..."
npm install --no-audit --no-fund --no-update-notifier

echo "  - Restarting MagicMirror..."
pm2 restart magicmirror 2>/dev/null || {
    echo "  - PM2 not running, starting MagicMirror..."
    pm2 start npm --name "magicmirror" -- start
    pm2 save
}

echo -e "\n${GREEN}Deployment complete!${NC}"
echo -e "\nView logs with: ${YELLOW}pm2 logs magicmirror${NC}"
ENDSSH

echo -e "\n${GREEN}=== Deployment Successful ===${NC}"
echo -e "MagicMirror has been updated on the Raspberry Pi"
echo -e "\nTo view logs, run: ${YELLOW}ssh $PI_USER@$PI_HOST 'pm2 logs magicmirror'${NC}"
