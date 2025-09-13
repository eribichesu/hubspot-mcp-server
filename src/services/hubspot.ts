import { Client } from "@hubspot/api-client";

export interface HubSpotConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

export class HubSpotService {
  private client: Client;

  constructor(config: HubSpotConfig) {
    this.client = new Client();

    if (config.apiKey) {
      this.client.setApiKey(config.apiKey);
    } else if (config.accessToken) {
      this.client.setAccessToken(config.accessToken);
    } else {
      throw new Error("Either API key or access token must be provided");
    }
  }

  getClient(): Client {
    return this.client;
  }

  // Contacts
  async getContacts(limit: number = 10, properties?: string[]) {
    const defaultProperties = properties || [
      "firstname",
      "lastname",
      "email",
      "phone",
      "company",
      "lifecyclestage",
    ];

    return await this.client.crm.contacts.basicApi.getPage(
      limit,
      undefined,
      defaultProperties
    );
  }

  async getContact(contactId: string, properties?: string[]) {
    const defaultProperties = properties || [
      "firstname",
      "lastname",
      "email",
      "phone",
      "company",
      "lifecyclestage",
      "createdate",
      "lastmodifieddate",
    ];

    return await this.client.crm.contacts.basicApi.getById(
      contactId,
      defaultProperties
    );
  }

  async createContact(properties: Record<string, any>) {
    const contactInput = {
      properties,
    };

    return await this.client.crm.contacts.basicApi.create(contactInput);
  }

  async updateContact(contactId: string, properties: Record<string, any>) {
    const contactInput = {
      properties,
    };

    return await this.client.crm.contacts.basicApi.update(
      contactId,
      contactInput
    );
  }

  async searchContacts(query: string, properties?: string[]) {
    const defaultProperties = properties || [
      "firstname",
      "lastname",
      "email",
      "phone",
      "company",
    ];

    const searchRequest = {
      query,
      limit: 10,
      properties: defaultProperties,
    };

    return await this.client.crm.contacts.searchApi.doSearch(searchRequest);
  }

  // Companies
  async getCompanies(limit: number = 10, properties?: string[]) {
    const defaultProperties = properties || [
      "name",
      "domain",
      "industry",
      "city",
      "state",
      "country",
    ];

    return await this.client.crm.companies.basicApi.getPage(
      limit,
      undefined,
      defaultProperties
    );
  }

  async getCompany(companyId: string, properties?: string[]) {
    const defaultProperties = properties || [
      "name",
      "domain",
      "industry",
      "city",
      "state",
      "country",
      "createdate",
      "lastmodifieddate",
    ];

    return await this.client.crm.companies.basicApi.getById(
      companyId,
      defaultProperties
    );
  }

  async createCompany(properties: Record<string, any>) {
    const companyInput = {
      properties,
    };

    return await this.client.crm.companies.basicApi.create(companyInput);
  }

  async updateCompany(companyId: string, properties: Record<string, any>) {
    const companyInput = {
      properties,
    };

    return await this.client.crm.companies.basicApi.update(
      companyId,
      companyInput
    );
  }

  // Deals
  async getDeals(limit: number = 10, properties?: string[]) {
    const defaultProperties = properties || [
      "dealname",
      "amount",
      "dealstage",
      "pipeline",
      "closedate",
      "dealtype",
    ];

    return await this.client.crm.deals.basicApi.getPage(
      limit,
      undefined,
      defaultProperties
    );
  }

  async getDeal(dealId: string, properties?: string[]) {
    const defaultProperties = properties || [
      "dealname",
      "amount",
      "dealstage",
      "pipeline",
      "closedate",
      "dealtype",
      "createdate",
      "lastmodifieddate",
    ];

    return await this.client.crm.deals.basicApi.getById(
      dealId,
      defaultProperties
    );
  }

  async createDeal(properties: Record<string, any>) {
    const dealInput = {
      properties,
    };

    return await this.client.crm.deals.basicApi.create(dealInput);
  }

  async updateDeal(dealId: string, properties: Record<string, any>) {
    const dealInput = {
      properties,
    };

    return await this.client.crm.deals.basicApi.update(dealId, dealInput);
  }

  // Email
  async sendEmail(emailData: {
    to: string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
  }) {
    // Note: This requires the Marketing Email API and specific permissions
    // For now, we'll create a placeholder implementation
    console.log("Email sending functionality requires Marketing Email API setup");
    return {
      message: "Email functionality not yet implemented",
      data: emailData,
    };
  }
}