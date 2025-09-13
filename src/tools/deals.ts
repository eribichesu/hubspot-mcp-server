import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { BaseTool } from "./base.js";

export class DealTool extends BaseTool {
  getTools(): Tool[] {
    return [
      {
        name: "get_deals",
        description: "Get a list of deals from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Number of deals to retrieve (default: 10, max: 100)",
              default: 10,
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of deal properties to retrieve",
              default: ["dealname", "amount", "dealstage", "pipeline", "closedate"],
            },
          },
        },
      },
      {
        name: "get_deal",
        description: "Get a specific deal by ID from HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            dealId: {
              type: "string",
              description: "The ID of the deal to retrieve",
            },
            properties: {
              type: "array",
              items: { type: "string" },
              description: "List of deal properties to retrieve",
              default: ["dealname", "amount", "dealstage", "pipeline", "closedate"],
            },
          },
          required: ["dealId"],
        },
      },
      {
        name: "create_deal",
        description: "Create a new deal in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            dealname: {
              type: "string",
              description: "Deal name/title",
            },
            amount: {
              type: "number",
              description: "Deal amount/value",
            },
            dealstage: {
              type: "string",
              description: "Deal stage (e.g., 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost')",
            },
            pipeline: {
              type: "string",
              description: "Deal pipeline ID",
            },
            closedate: {
              type: "string",
              description: "Expected close date (YYYY-MM-DD format)",
            },
            dealtype: {
              type: "string",
              description: "Type of deal (e.g., 'newbusiness', 'existingbusiness')",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the deal",
            },
          },
          required: ["dealname", "dealstage"],
        },
      },
      {
        name: "update_deal",
        description: "Update an existing deal in HubSpot",
        inputSchema: {
          type: "object",
          properties: {
            dealId: {
              type: "string",
              description: "The ID of the deal to update",
            },
            dealname: {
              type: "string",
              description: "Deal name/title",
            },
            amount: {
              type: "number",
              description: "Deal amount/value",
            },
            dealstage: {
              type: "string",
              description: "Deal stage",
            },
            pipeline: {
              type: "string",
              description: "Deal pipeline ID",
            },
            closedate: {
              type: "string",
              description: "Expected close date (YYYY-MM-DD format)",
            },
            dealtype: {
              type: "string",
              description: "Type of deal",
            },
            additionalProperties: {
              type: "object",
              description: "Additional custom properties for the deal",
            },
          },
          required: ["dealId"],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case "get_deals":
        return await this.getDeals(args);
      case "get_deal":
        return await this.getDeal(args);
      case "create_deal":
        return await this.createDeal(args);
      case "update_deal":
        return await this.updateDeal(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async getDeals(args: any) {
    const { limit = 10, properties } = args;
    const result = await this.hubspotService.getDeals(limit, properties);
    
    return {
      success: true,
      data: result.results,
      count: result.results?.length || 0,
      hasMore: !!result.paging?.next,
    };
  }

  private async getDeal(args: any) {
    this.validateRequiredArgs(args, ["dealId"]);
    const { dealId, properties } = args;
    
    const result = await this.hubspotService.getDeal(dealId, properties);
    
    return {
      success: true,
      data: result,
    };
  }

  private async createDeal(args: any) {
    this.validateRequiredArgs(args, ["dealname", "dealstage"]);
    
    const {
      dealname,
      amount,
      dealstage,
      pipeline,
      closedate,
      dealtype,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      dealname,
      dealstage,
      ...(amount && { amount: amount.toString() }),
      ...(pipeline && { pipeline }),
      ...(closedate && { closedate }),
      ...(dealtype && { dealtype }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    const result = await this.hubspotService.createDeal(properties);
    
    return {
      success: true,
      data: result,
      message: "Deal created successfully",
    };
  }

  private async updateDeal(args: any) {
    this.validateRequiredArgs(args, ["dealId"]);
    
    const {
      dealId,
      dealname,
      amount,
      dealstage,
      pipeline,
      closedate,
      dealtype,
      additionalProperties,
      ...otherProps
    } = args;

    const properties: Record<string, any> = {
      ...(dealname && { dealname }),
      ...(amount && { amount: amount.toString() }),
      ...(dealstage && { dealstage }),
      ...(pipeline && { pipeline }),
      ...(closedate && { closedate }),
      ...(dealtype && { dealtype }),
      ...otherProps,
      ...(additionalProperties || {}),
    };

    // Remove undefined/null values
    Object.keys(properties).forEach(key => {
      if (properties[key] === undefined || properties[key] === null) {
        delete properties[key];
      }
    });

    const result = await this.hubspotService.updateDeal(dealId, properties);
    
    return {
      success: true,
      data: result,
      message: "Deal updated successfully",
    };
  }
}