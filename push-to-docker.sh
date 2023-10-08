#!/bin/bash

# push-to-docker.sh
# This script automates the process of pushing a new image to Docker Hub.
# Usage:
# ./push-to-docker.sh          # For auto incrementing patch version by 0.01
# ./push-to-docker.sh [version]  # For specifying a version manually, e.g., 2.00


source credentials.config

# Login to Docker Hub
echo "$DOCKER_PASSWORD" | docker login --username $DOCKER_USERNAME --password-stdin

# Build a new Docker image
docker build -t $DOCKER_USERNAME/$DOCKER_REPO .

# Retrieve the last version number
LAST_VERSION=$(docker images --format "{{.Tag}}" $DOCKER_USERNAME/$DOCKER_REPO | grep -E '^[0-9.]+$' | sort -V | tail -n 1)
echo "Latest version in docker hub: $LAST_VERSION"

# If no version found, start from "1.00"
if [ "$LAST_VERSION" == "<none>" ] || [ -z "$LAST_VERSION" ]; then
  LAST_VERSION="1.00"
fi

NEW_VERSION=""
if [ "$1" != "" ]; then
  NEW_VERSION=$1
else
  LAST_VERSION=$(docker images --format "{{.Tag}}" $DOCKER_USERNAME/$DOCKER_REPO | grep -E '^[0-9.]+$' | sort -V | tail -n 1)
  NEW_VERSION=$(echo "scale=2; $LAST_VERSION + 0.01" | bc | sed 's/,/./')
fi

# Increment the last version
NEW_VERSION=$(echo "scale=2; $LAST_VERSION + 0.01" | bc | sed 's/,/./')

# Tag the new image
docker tag $DOCKER_USERNAME/$DOCKER_REPO:latest $DOCKER_USERNAME/$DOCKER_REPO:$NEW_VERSION

# Push both the 'latest' tag and the new version tag to Docker Hub
docker push $DOCKER_USERNAME/$DOCKER_REPO:latest
docker push $DOCKER_USERNAME/$DOCKER_REPO:$NEW_VERSION

echo "Pushed new version: $NEW_VERSION (and :latest)"
