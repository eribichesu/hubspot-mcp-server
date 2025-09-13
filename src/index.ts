#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { HubSpotService } from "./services/hubspot";
import { ContactTool } from "./tools/contacts";
import { CompanyTool } from "./tools/companies";
import { DealTool } from "./tools/deals";
import { EmailTool } from "./tools/emails";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

class HubSpotMCPServer {
  private server: Server;
  private hubspotService: HubSpotService;
  private tools: Map<string, any> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: "hubspot-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.hubspotService = new HubSpotService({
      apiKey: process.env.HUBSPOT_API_KEY,
      clientId: process.env.HUBSPOT_CLIENT_ID,
      clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    });

    this.initializeTools();
    this.setupHandlers();
  }

  private initializeTools() {
    const contactTool = new ContactTool(this.hubspotService);
    const companyTool = new CompanyTool(this.hubspotService);
    const dealTool = new DealTool(this.hubspotService);
    const emailTool = new EmailTool(this.hubspotService);

    // Register tools
    contactTool.getTools().forEach((tool) => {
      this.tools.set(tool.name, contactTool);
    });

    companyTool.getTools().forEach((tool) => {
      this.tools.set(tool.name, companyTool);
    });

    dealTool.getTools().forEach((tool) => {
      this.tools.set(tool.name, dealTool);
    });

    emailTool.getTools().forEach((tool) => {
      this.tools.set(tool.name, emailTool);
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const allTools: Tool[] = [];

      for (const toolInstance of this.tools.values()) {
        allTools.push(...toolInstance.getTools());
      }

      return {
        tools: allTools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const toolInstance = this.tools.get(name);
      if (!toolInstance) {
        throw new Error(`Unknown tool: ${name}`);
      }

      try {
        const result = await toolInstance.executeTool(name, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text",
              text: `Error executing tool ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("HubSpot MCP Server running on stdio");
  }
}

if (require.main === module) {
  const server = new HubSpotMCPServer();
  server.run().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
}

export { HubSpotMCPServer };