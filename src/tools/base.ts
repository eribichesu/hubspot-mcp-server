import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { HubSpotService } from "../services/hubspot.js";

export abstract class BaseTool {
  protected hubspotService: HubSpotService;

  constructor(hubspotService: HubSpotService) {
    this.hubspotService = hubspotService;
  }

  abstract getTools(): Tool[];
  abstract executeTool(name: string, args: any): Promise<any>;

  protected validateRequiredArgs(args: any, required: string[]): void {
    for (const field of required) {
      if (!args[field]) {
        throw new Error(`Missing required argument: ${field}`);
      }
    }
  }
}