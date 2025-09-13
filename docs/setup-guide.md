# Setup Guide

This guide will walk you through setting up the HubSpot MCP Server step by step.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and npm installed
- A **HubSpot account** (free or paid)
- **Claude Desktop** or another MCP client

## Step 1: Installation

### Clone and Install
```bash
git clone https://github.com/eribichesu/hubspot-mcp-server.git
cd hubspot-mcp-server
npm install
```

### Build the Project
```bash
npm run build
```

## Step 2: HubSpot API Setup

### Get Your API Key

1. **Login to HubSpot**
   - Go to your HubSpot account
   - Navigate to **Settings** → **Integrations** → **API key**

2. **Generate API Key**
   - Click "Create key" if you don't have one
   - Copy the generated API key

3. **Set Permissions**
   - Ensure your API key has access to:
     - Contacts (read/write)
     - Companies (read/write)
     - Deals (read/write)
     - Emails (if using email features)

### Alternative: OAuth Setup (Advanced)

For production applications, consider using OAuth:

1. **Create HubSpot App**
   - Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
   - Create a new app
   - Configure scopes: `contacts`, `companies`, `deals`

2. **Get Credentials**
   - Note your Client ID and Client Secret
   - Set up redirect URI

## Step 3: Environment Configuration

### Create Environment File
```bash
cp .env.example .env
```

### Configure Your API Key
Edit `.env` file:
```env
HUBSPOT_API_KEY=your_actual_api_key_here
HUBSPOT_APP_ID=your_app_id_here
HUBSPOT_CLIENT_ID=your_client_id_here
HUBSPOT_CLIENT_SECRET=your_client_secret_here

# Optional: Custom configurations
MCP_SERVER_NAME=hubspot-mcp-server
LOG_LEVEL=info
NODE_ENV=development
```

## Step 4: Test the Setup

### Run Basic Test
```bash
npm test
```

### Test Server Manually
```bash
npm run dev
```

This should start the server and show available tools.

## Step 5: Claude Desktop Integration

### Locate Claude Config
Find your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Add MCP Server Configuration
Edit the config file to include:
```json
{
  "mcpServers": {
    "hubspot": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/absolute/path/to/hubspot-mcp-server",
      "env": {
        "HUBSPOT_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/hubspot-mcp-server` with the actual path to your project.

### Restart Claude Desktop
Close and reopen Claude Desktop for changes to take effect.

## Step 6: Verify Integration

### Test in Claude
Try these commands in Claude:

1. **"Show me my recent contacts"**
2. **"Create a contact for John Smith with email john@example.com"**
3. **"List my companies"**
4. **"Search for deals in the pipeline"**

### Expected Behavior
- Claude should be able to fetch and display HubSpot data
- You should see properly formatted responses
- Operations should complete successfully

## Common Issues

### "API key not found"
- Double-check your `.env` file
- Ensure the API key is valid
- Verify the API key has necessary permissions

### "Module not found" errors
- Run `npm install` again
- Ensure all dependencies are installed
- Try deleting `node_modules` and reinstalling

### "Permission denied" errors
- Check HubSpot API key permissions
- Ensure your HubSpot account has access to the required features
- For free accounts, some features may be limited

### Claude doesn't see the server
- Verify the config file path is correct
- Check that the `cwd` path in config is absolute and correct
- Restart Claude Desktop after config changes
- Check Claude's error logs for connection issues

## Production Considerations

### Security
- Never commit API keys to version control
- Use environment variables or secure secret management
- Consider OAuth for multi-user applications

### Performance
- Be aware of HubSpot API rate limits
- Implement caching for frequently accessed data
- Use pagination for large datasets

### Monitoring
- Set up logging for production
- Monitor API usage and errors
- Implement health checks

## Next Steps

Once setup is complete:
1. Read the [API Examples](api-examples.md) for usage patterns
2. Check [Troubleshooting Guide](troubleshooting.md) for common issues
3. Explore [Advanced Configuration](advanced-config.md) for customization

## Support

If you encounter issues:
1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Review [GitHub Issues](https://github.com/eribichesu/hubspot-mcp-server/issues)
3. Create a new issue with detailed error information