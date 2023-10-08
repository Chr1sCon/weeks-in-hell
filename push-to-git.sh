#!/bin/bash

# Documentation
# Usage: ./pushToGit.sh [commit message]
# If no commit message is provided, "Minor update" will be used.
# Make sure you have 'credentials.config' with GIT_USERNAME and GIT_PASSWORD fields in the same folder as the script.

# Read credentials from credentials.config
source credentials.config

# Set commit message from argument or default to "Minor update"
COMMIT_MSG="${1:-Minor update}"

# Log in to GitHub (consider more secure methods for storing and using credentials)
git config --global credential.helper store
echo "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com" > ~/.git-credentials

# Add all files to staging
git add .

# Commit with given message or default message
git commit -m "$COMMIT_MSG"

# Push to 'main' branch
git push origin main

# Cleanup
unset COMMIT_MSG
