#!/bin/bash

# Exit on any error
set -e

# Check if .env.local file exists and source it
if [ -f .env.local ]; then
    source .env.local
else
    echo "Error: .env.local file not found"
    exit 1
fi

# Check if ADMIN_PASSWORD is set after sourcing .env.local
if [ -z "$ADMIN_PASSWORD" ]; then
    echo "Error: ADMIN_PASSWORD is not set in .env.local file"
    exit 1
fi

# Run the deployment command
echo "Deploying with ADMIN_PASSWORD..."
ADMIN_PASSWORD="$ADMIN_PASSWORD" sst deploy

echo "Deployment complete!"