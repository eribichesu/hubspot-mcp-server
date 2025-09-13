#!/bin/bash

# HubSpot Token Renewal Script
# This script helps you renew your HubSpot access token for the MCP server

echo "🔄 HubSpot Token Renewal Script"
echo "================================"

# Check if hubspot.config.yml exists
if [ ! -f "hubspot.config.yml" ]; then
    echo "❌ No hubspot.config.yml found. Please run 'hs init' first."
    exit 1
fi

# Extract current token info
echo "📊 Current token info:"
grep -A 1 "expiresAt:" hubspot.config.yml || echo "No expiration info found"

echo ""
echo "To renew your token:"
echo "1. Go to HubSpot Settings → Integrations → API key"
echo "2. Click 'Regenerate' to create a new Personal Access Key"
echo "3. Copy the new key"
echo "4. Run: hs auth --auth-type personalaccesskey --personal-access-key YOUR_NEW_KEY"
echo ""

read -p "Do you want to check your current token expiration? (y/n): " check_exp

if [ "$check_exp" = "y" ] || [ "$check_exp" = "Y" ]; then
    expiry=$(grep "expiresAt:" hubspot.config.yml | cut -d"'" -f2)
    if [ ! -z "$expiry" ]; then
        echo "⏰ Current token expires at: $expiry"
        
        # Check if token is expired (simple check)
        current_time=$(date -u +"%Y-%m-%dT%H:%M:%S")
        if [[ "$expiry" < "$current_time" ]]; then
            echo "🚨 TOKEN IS EXPIRED! Please renew immediately."
        else
            echo "✅ Token is still valid."
        fi
    fi
fi

echo ""
echo "After renewing, run this script again or manually update Claude Desktop config:"
echo "~/Library/Application Support/Claude/claude_desktop_config.json"