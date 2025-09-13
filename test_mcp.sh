#!/bin/bash
export NODE_PATH=/opt/homebrew/bin/node
cd /Users/edoardo.ribichesu/vscode/hubspot.mcp
source .env
echo "Starting MCP server with environment:"
echo "HUBSPOT_ACCESS_TOKEN is set: ${HUBSPOT_ACCESS_TOKEN:+yes}"
echo "Environment variables loaded, starting server..."
exec /opt/homebrew/bin/node dist/index.js