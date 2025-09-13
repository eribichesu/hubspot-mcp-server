#!/bin/bash

# Update Claude Desktop with Fresh HubSpot Token
# Run this after renewing your HubSpot authentication

set -e

CLAUDE_CONFIG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
HUBSPOT_CONFIG="./hubspot.config.yml"

echo "🔄 Updating Claude Desktop with fresh HubSpot token..."

# Check if files exist
if [ ! -f "$HUBSPOT_CONFIG" ]; then
    echo "❌ hubspot.config.yml not found. Please run 'hs auth' first."
    exit 1
fi

if [ ! -f "$CLAUDE_CONFIG" ]; then
    echo "❌ Claude Desktop config not found at: $CLAUDE_CONFIG"
    exit 1
fi

# Extract the access token (handle multiline YAML)
echo "📊 Extracting access token from HubSpot config..."
ACCESS_TOKEN=$(awk '/accessToken: >-/{flag=1; next} flag && /^[[:space:]]*[^[:space:]]/ && !/^[[:space:]]*$/{if($0 !~ /^[[:space:]]*expiresAt:/) {gsub(/^[[:space:]]*/, ""); printf "%s", $0} else {flag=0}}' "$HUBSPOT_CONFIG")

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Could not extract access token from hubspot.config.yml"
    exit 1
fi

echo "✅ Token extracted (length: ${#ACCESS_TOKEN} characters)"

# Create backup of Claude config
cp "$CLAUDE_CONFIG" "$CLAUDE_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"

# Update Claude config with new token
echo "🔧 Updating Claude Desktop configuration..."
cat > "$CLAUDE_CONFIG" << EOF
{
  "mcpServers": {
    "hubspot": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/Users/edoardo.ribichesu/vscode/hubspot.mcp/dist/index.js"],
      "cwd": "/Users/edoardo.ribichesu/vscode/hubspot.mcp",
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "$ACCESS_TOKEN"
      }
    }
  }
}
EOF

echo "✅ Claude Desktop config updated successfully!"

# Show expiration info
EXPIRY=$(grep "expiresAt:" "$HUBSPOT_CONFIG" | cut -d"'" -f2)
if [ ! -z "$EXPIRY" ]; then
    echo "⏰ New token expires at: $EXPIRY"
fi

echo ""
echo "🚀 Next steps:"
echo "1. Restart Claude Desktop: pkill -f Claude && open -a Claude"
echo "2. Test the connection by asking Claude about HubSpot contacts"
echo ""
echo "💡 Tip: Run this script whenever your token expires!"