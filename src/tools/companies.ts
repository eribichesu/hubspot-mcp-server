import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseTool } from "./base";

export class CompanyTool extends BaseTool {
  getTools(): Tool[] {
    return [
      {
        name: "get_companies",
        description: "Get a list of companies from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of companies to retrieve (default: 10, max: 100)",
              default: 10,
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of company properties to retrieve",
              default: ["name", "domain", "industry", "city", "state"],
            },
          },
        },
      },
      {
        name: "get_company",
        description: "Get a specific company by ID from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            companyId: {
              type: "string",
              description: "The ID of the company to retrieve",
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of company properties to retrieve",
              default: ["name", "domain", "industry", "city", "state"],
            },
          },
          required: ["companyId"],
        },
      },
      {
        name: "create_company",
        description: "Create a new company in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Company name",
            },
            domain: {
              type: "string",
              description: "Company domain/website",
            },
            industry: {
              type: "string",
              description: "Company industry",
            },
            city: {
              type: "string",
              description: "Company city",
            },
            state: {
              type: "string",
              description: "Company state/province",
            },
            country: {
              type: "string",
              description: "Company country",
            },
            phone: {
              type: "string",
              description: "Company phone number",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the company",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "update_company",
        description: "Update an existing company in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            companyId: {
              type: "string",
              description: "The ID of the company to update",
            },
            name: {
              type: "string",
              description: "Company name",
            },
            domain: {
              type: "string",
              description: "Company domain/website",
            },
            industry: {
              type: "string",
              description: "Company industry",
            },
            city: {
              type: "string",
              description: "Company city",
            },
            state: {
              type: "string",
              description: "Company state/province",
            },
            country: {
              type: "string",
              description: "Company country",
            },
            phone: {
              type: "string",
              description: "Company phone number",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the company",
            },
          },
          required: ["companyId"],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "get_companies":
        return await this.getCompanies(args);
      case "get_company":
        return await this.getCompany(args);
      case "create_company":
        return await this.createCompany(args);
      case "update_company":
        return await this.updateCompany(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async getCompanies(args: any) {
    const { limit = 10, properties } = args;
    const result = await this.hubspotService.getCompanies(limit, properties);
    
    return {
      success: true,
      data: result.results,
      count: result.results?.length || 0,
      hasMore: !!result.paging?.next,
    };
  }

  private async getCompany(args: any) {
    this.validateRequiredArgs(args, ["companyId"]);
    const { companyId, properties } = args;
    
    const result = await this.hubspotService.getCompany(companyId, properties);
    
    return {
      success: true,
      data: result,
    };
  }

  private async createCompany(args: any) {
    this.validateRequiredArgs(args, ["name"]);
    
    const {
      name,
      domain,
      industry,
      city,
      state,
      country,
      phone,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      name,
      ...(domain && { domain }),
      ...(industry && { industry }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(phone && { phone }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    const result = await this.hubspotService.createCompany(properties);
    
    return {
      success: true,
      data: result,
      message: "Company created successfully",
    };
  }

  private async updateCompany(args: any) {
    this.validateRequiredArgs(args, ["companyId"]);
    
    const {
      companyId,
      name,
      domain,
      industry,
      city,
      state,
      country,
      phone,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      ...(name && { name }),
      ...(domain && { domain }),
      ...(industry && { industry }),
      ...(city && { city }),
      ...(state && { state }),
      ...(country && { country }),
      ...(phone && { phone }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    // Remove undefined/null values
    Object.keys(properties).forEach(key => {
      if (properties[key] === undefined || properties[key] === null) {
        delete properties[key];
      }
    });

    const result = await this.hubspotService.updateCompany(companyId, properties);
    
    return {
      success: true,
      data: result,
      message: "Company updated successfully",
    };
  }
}