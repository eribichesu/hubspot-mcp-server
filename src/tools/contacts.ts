import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseTool } from "./base";

export class ContactTool extends BaseTool {
  getTools(): Tool[] {
    return [
      {
        name: "get_contacts",
        description: "Get a list of contacts from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of contacts to retrieve (default: 10, max: 100)",
              default: 10,
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of contact properties to retrieve",
              default: ["firstname", "lastname", "email", "phone", "company"],
            },
          },
        },
      },
      {
        name: "get_contact",
        description: "Get a specific contact by ID from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            contactId: {
              type: "string",
              description: "The ID of the contact to retrieve",
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of contact properties to retrieve",
              default: ["firstname", "lastname", "email", "phone", "company"],
            },
          },
          required: ["contactId"],
        },
      },
      {
        name: "create_contact",
        description: "Create a new contact in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "Contact's email address",
            },
            firstname: {
              type: "string",
              description: "Contact's first name",
            },
            lastname: {
              type: "string",
              description: "Contact's last name",
            },
            phone: {
              type: "string",
              description: "Contact's phone number",
            },
            company: {
              type: "string",
              description: "Contact's company name",
            },
            lifecyclestage: {
              type: "string",
              description: "Contact's lifecycle stage",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the contact",
            },
          },
          required: ["email"],
        },
      },
      {
        name: "update_contact",
        description: "Update an existing contact in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            contactId: {
              type: "string",
              description: "The ID of the contact to update",
            },
            firstname: {
              type: "string",
              description: "Contact's first name",
            },
            lastname: {
              type: "string",
              description: "Contact's last name",
            },
            email: {
              type: "string",
              description: "Contact's email address",
            },
            phone: {
              type: "string",
              description: "Contact's phone number",
            },
            company: {
              type: "string",
              description: "Contact's company name",
            },
            lifecyclestage: {
              type: "string",
              description: "Contact's lifecycle stage",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the contact",
            },
          },
          required: ["contactId"],
        },
      },
      {
        name: "search_contacts",
        description: "Search for contacts in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (name, email, or other contact information)",
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of contact properties to retrieve",
              default: ["firstname", "lastname", "email", "phone", "company"],
            },
          },
          required: ["query"],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "get_contacts":
        return await this.getContacts(args);
      case "get_contact":
        return await this.getContact(args);
      case "create_contact":
        return await this.createContact(args);
      case "update_contact":
        return await this.updateContact(args);
      case "search_contacts":
        return await this.searchContacts(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async getContacts(args: any) {
    const { limit = 10, properties } = args;
    const result = await this.hubspotService.getContacts(limit, properties);
    
    return {
      success: true,
      data: result.results,
      count: result.results?.length || 0,
      hasMore: !!result.paging?.next,
    };
  }

  private async getContact(args: any) {
    this.validateRequiredArgs(args, ["contactId"]);
    const { contactId, properties } = args;
    
    const result = await this.hubspotService.getContact(contactId, properties);
    
    return {
      success: true,
      data: result,
    };
  }

  private async createContact(args: any) {
    this.validateRequiredArgs(args, ["email"]);
    
    const {
      email,
      firstname,
      lastname,
      phone,
      company,
      lifecyclestage,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      email,
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(phone && { phone }),
      ...(company && { company }),
      ...(lifecyclestage && { lifecyclestage }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    const result = await this.hubspotService.createContact(properties);
    
    return {
      success: true,
      data: result,
      message: "Contact created successfully",
    };
  }

  private async updateContact(args: any) {
    this.validateRequiredArgs(args, ["contactId"]);
    
    const {
      contactId,
      firstname,
      lastname,
      email,
      phone,
      company,
      lifecyclestage,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      ...(firstname && { firstname }),
      ...(lastname && { lastname }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(company && { company }),
      ...(lifecyclestage && { lifecyclestage }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    // Remove undefined/null values
    Object.keys(properties).forEach(key => {
      if (properties[key] === undefined || properties[key] === null) {
        delete properties[key];
      }
    });

    const result = await this.hubspotService.updateContact(contactId, properties);
    
    return {
      success: true,
      data: result,
      message: "Contact updated successfully",
    };
  }

  private async searchContacts(args: any) {
    this.validateRequiredArgs(args, ["query"]);
    const { query, properties } = args;
    
    const result = await this.hubspotService.searchContacts(query, properties);
    
    return {
      success: true,
      data: result.results,
      count: result.results?.length || 0,
      query,
      hasMore: !!result.paging?.next,
    };
  }
}