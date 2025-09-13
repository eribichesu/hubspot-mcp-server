# HubSpot MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with HubSpot CRM. This server enables AI assistants like Claude to interact with your HubSpot data, allowing for efficient management of contacts, companies, deals, and more.

## 🚀 Features

- **Contacts Management**: Create, read, update, and search contacts in HubSpot
- **Companies Management**: Manage company records and information
- **Deals Management**: Track and update sales opportunities
- **Email Integration**: Send emails and track engagement (requires setup)
- **Type-Safe**: Built with TypeScript for better development experience
- **Comprehensive Testing**: Includes unit tests and integration examples
- **Easy Setup**: Simple configuration with environment variables

## 📋 Available Tools

### Contacts
- `get_contacts` - Retrieve a list of contacts
- `get_contact` - Get a specific contact by ID
- `create_contact` - Create a new contact
- `update_contact` - Update an existing contact
- `search_contacts` - Search for contacts

### Companies
- `get_companies` - Retrieve a list of companies
- `get_company` - Get a specific company by ID
- `create_company` - Create a new company
- `update_company` - Update an existing company

### Deals
- `get_deals` - Retrieve a list of deals
- `get_deal` - Get a specific deal by ID
- `create_deal` - Create a new deal
- `update_deal` - Update an existing deal

### Emails
- `send_email` - Send emails through HubSpot (requires Marketing Email API)
- `get_email_events` - Get email engagement data (requires Events API)

## 🛠️ Prerequisites

- Node.js 18+ and npm
- HubSpot account with API access
- HubSpot API key or OAuth credentials

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/hubspot-mcp-server.git
   cd hubspot-mcp-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your HubSpot credentials:
   ```env
   HUBSPOT_API_KEY=your_hubspot_api_key_here
   # OR use OAuth (if you prefer)
   HUBSPOT_CLIENT_ID=your_client_id
   HUBSPOT_CLIENT_SECRET=your_client_secret
   HUBSPOT_ACCESS_TOKEN=your_access_token
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

## 🔧 Getting HubSpot API Credentials

### Option 1: API Key (Recommended for testing)
1. Go to HubSpot Settings → Integrations → API key
2. Generate a new API key
3. Add it to your `.env` file as `HUBSPOT_API_KEY`

### Option 2: OAuth App (Recommended for production)
1. Go to HubSpot Developer Account → Apps
2. Create a new app
3. Note your Client ID and Client Secret
4. Configure OAuth redirect URI
5. Add credentials to your `.env` file

## 🚀 Usage

### With Claude Desktop

1. **Configure Claude Desktop** by adding to your MCP settings:
   ```json
   {
     "mcpServers": {
       "hubspot": {
         "command": "node",
         "args": ["dist/index.js"],
         "cwd": "/path/to/hubspot-mcp-server",
         "env": {
           "HUBSPOT_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

2. **Restart Claude Desktop**

3. **Start using HubSpot tools** in Claude:
   - "Show me my recent contacts"
   - "Create a new contact for John Doe with email john@example.com"
   - "Search for companies in the technology industry"

### Direct Usage

You can also run the server directly:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run a manual test of the server:
```bash
npm run dev
# In another terminal:
node tests/test-server.js
```

## 📖 Examples

### Creating a Contact
```typescript
// Using the MCP tool
{
  "tool": "create_contact",
  "arguments": {
    "email": "jane.doe@example.com",
    "firstname": "Jane",
    "lastname": "Doe",
    "phone": "+1-555-123-4567",
    "company": "Example Corp",
    "lifecyclestage": "lead"
  }
}
```

### Searching for Companies
```typescript
// This would be handled automatically by Claude when you ask:
// "Find all companies in the software industry"
{
  "tool": "get_companies",
  "arguments": {
    "limit": 20,
    "properties": ["name", "domain", "industry", "city", "state"]
  }
}
```

## 🏗️ Development

### Project Structure
```
src/
├── index.ts              # Main MCP server
├── services/
│   └── hubspot.ts        # HubSpot API wrapper
├── tools/
│   ├── base.ts           # Base tool class
│   ├── contacts.ts       # Contact management tools
│   ├── companies.ts      # Company management tools
│   ├── deals.ts          # Deal management tools
│   └── emails.ts         # Email tools
└── types/
    └── index.ts          # Type definitions

tests/
├── setup.ts              # Test configuration
├── hubspot.service.test.ts
├── contacts.tool.test.ts
└── test-server.ts        # Manual testing script
```

### Adding New Tools

1. Create a new tool class extending `BaseTool`
2. Implement `getTools()` and `executeTool()` methods
3. Register the tool in `src/index.ts`
4. Add tests for the new tool

### Code Style

This project uses TypeScript with strict mode enabled. Make sure to:
- Use proper type annotations
- Follow existing naming conventions
- Add JSDoc comments for public methods
- Write tests for new functionality

## 🔒 Security Considerations

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use `.env` files for local development
- **Production**: Use proper secret management in production
- **Rate Limiting**: Be aware of HubSpot API rate limits
- **Permissions**: Only request necessary HubSpot scopes

## 📚 Resources

- [HubSpot API Documentation](https://developers.hubspot.com/docs/api/overview)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Claude Desktop MCP Setup](https://docs.anthropic.com/claude/docs/mcp)
- [HubSpot API Node.js Client](https://github.com/HubSpot/hubspot-api-nodejs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**"API key not found" error**:
- Ensure your `.env` file is properly configured
- Check that the API key is valid and has necessary permissions

**"Module not found" errors**:
- Run `npm install` to ensure all dependencies are installed
- Run `npm run build` to compile TypeScript

**Rate limiting errors**:
- HubSpot has API rate limits. Implement proper retry logic for production use
- Consider using exponential backoff for failed requests

**Connection timeouts**:
- Check your internet connection
- Verify HubSpot service status

For more help, please [open an issue](https://github.com/yourusername/hubspot-mcp-server/issues).

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Use a proper secrets management system
2. **Logging**: Configure appropriate log levels
3. **Monitoring**: Set up health checks and monitoring
4. **Scaling**: Consider rate limiting and caching for high-volume usage

### Docker Support (Coming Soon)

Docker support will be added in a future release for easier deployment.

---

**Built with ❤️ for the HubSpot and AI community**