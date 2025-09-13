# API Examples

This document provides practical examples of using the HubSpot MCP Server tools.

## Contacts

### Get All Contacts
```typescript
// Tool: get_contacts
{
  "limit": 20,
  "properties": ["firstname", "lastname", "email", "phone", "company"]
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "properties": {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-123-4567",
        "company": "Example Corp"
      }
    }
  ],
  "count": 1,
  "hasMore": true
}
```

### Get Specific Contact
```typescript
// Tool: get_contact
{
  "contactId": "12345",
  "properties": ["firstname", "lastname", "email", "phone"]
}
```

### Create New Contact
```typescript
// Tool: create_contact
{
  "email": "jane.smith@example.com",
  "firstname": "Jane",
  "lastname": "Smith",
  "phone": "+1-555-987-6543",
  "company": "Smith Industries",
  "lifecyclestage": "lead",
  "additionalProperties": {
    "jobtitle": "CEO",
    "website": "https://smithindustries.com"
  }
}
```

### Update Contact
```typescript
// Tool: update_contact
{
  "contactId": "12345",
  "phone": "+1-555-999-8888",
  "lifecyclestage": "customer",
  "additionalProperties": {
    "last_contacted": "2024-01-15"
  }
}
```

### Search Contacts
```typescript
// Tool: search_contacts
{
  "query": "john@example.com",
  "properties": ["firstname", "lastname", "email", "company"]
}
```

## Companies

### Get All Companies
```typescript
// Tool: get_companies
{
  "limit": 15,
  "properties": ["name", "domain", "industry", "city", "state", "country"]
}
```

### Create Company
```typescript
// Tool: create_company
{
  "name": "TechStart Solutions",
  "domain": "techstart.com",
  "industry": "Technology",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "phone": "+1-415-555-0123",
  "additionalProperties": {
    "founded_year": "2020",
    "employee_count": "25"
  }
}
```

### Update Company
```typescript
// Tool: update_company
{
  "companyId": "67890",
  "industry": "Software Development",
  "city": "Austin",
  "additionalProperties": {
    "employee_count": "50",
    "annual_revenue": "5000000"
  }
}
```

## Deals

### Get All Deals
```typescript
// Tool: get_deals
{
  "limit": 10,
  "properties": ["dealname", "amount", "dealstage", "pipeline", "closedate"]
}
```

### Create Deal
```typescript
// Tool: create_deal
{
  "dealname": "Q1 Enterprise License",
  "amount": 50000,
  "dealstage": "qualifiedtobuy",
  "pipeline": "default",
  "closedate": "2024-03-31",
  "dealtype": "newbusiness",
  "additionalProperties": {
    "deal_source": "Website",
    "priority": "High"
  }
}
```

### Update Deal
```typescript
// Tool: update_deal
{
  "dealId": "deal123",
  "dealstage": "presentationscheduled",
  "amount": 75000,
  "closedate": "2024-04-15"
}
```

## Common Use Cases

### 1. Lead Qualification Workflow
```typescript
// 1. Search for existing contact
{
  "tool": "search_contacts",
  "arguments": {
    "query": "prospect@company.com"
  }
}

// 2. If not found, create new contact
{
  "tool": "create_contact",
  "arguments": {
    "email": "prospect@company.com",
    "firstname": "New",
    "lastname": "Prospect",
    "lifecyclestage": "lead"
  }
}

// 3. Create associated deal
{
  "tool": "create_deal",
  "arguments": {
    "dealname": "New Prospect Opportunity",
    "dealstage": "appointmentscheduled",
    "amount": 25000
  }
}
```

### 2. Data Enrichment
```typescript
// 1. Get company by domain
{
  "tool": "get_companies",
  "arguments": {
    "properties": ["name", "domain", "industry"]
  }
}

// 2. Update company with enriched data
{
  "tool": "update_company",
  "arguments": {
    "companyId": "company123",
    "additionalProperties": {
      "employee_count": "500",
      "annual_revenue": "50000000",
      "technology_stack": "Python, React, AWS"
    }
  }
}
```

### 3. Sales Pipeline Review
```typescript
// 1. Get all deals in specific stage
{
  "tool": "get_deals",
  "arguments": {
    "limit": 50,
    "properties": ["dealname", "amount", "closedate", "dealstage"]
  }
}

// 2. Update deal stages based on activities
{
  "tool": "update_deal",
  "arguments": {
    "dealId": "deal456",
    "dealstage": "closedwon"
  }
}
```

## Error Handling

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required argument: email"
}
```

### Invalid Contact ID
```json
{
  "success": false,
  "error": "Contact not found with ID: invalid123"
}
```

### API Rate Limiting
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please wait and try again."
}
```

## Best Practices

### 1. Property Selection
Always specify the properties you need to minimize API calls and response size:
```typescript
{
  "properties": ["firstname", "lastname", "email"] // Only what you need
}
```

### 2. Batch Operations
For multiple operations, plan your sequence to minimize API calls:
```typescript
// Good: Get contact, then update
// Better: Include all needed properties in initial get
```

### 3. Error Handling
Always check the `success` field in responses:
```typescript
if (result.success) {
  // Handle successful response
  const contacts = result.data;
} else {
  // Handle error
  console.error(result.error);
}
```

### 4. Data Validation
Validate data before sending to HubSpot:
```typescript
// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error("Invalid email format");
}
```

## Integration Patterns

### With Claude Desktop
Ask Claude natural language questions:
- "Show me contacts created this week"
- "Create a deal for $50k with Company XYZ"
- "Update John Doe's phone number to 555-1234"

### With Custom MCP Client
```typescript
import { MCPClient } from '@modelcontextprotocol/sdk/client';

const client = new MCPClient();
const result = await client.callTool('get_contacts', {
  limit: 10,
  properties: ['firstname', 'lastname', 'email']
});
```

## Performance Tips

1. **Use pagination** for large datasets
2. **Limit properties** to only what you need
3. **Cache frequently accessed data** when possible
4. **Implement retry logic** for rate limiting
5. **Use batch operations** when available

## Advanced Examples

### Custom Property Handling
```typescript
{
  "tool": "create_contact",
  "arguments": {
    "email": "custom@example.com",
    "additionalProperties": {
      "custom_field_1": "value1",
      "custom_field_2": "value2",
      "hs_lead_status": "OPEN"  // HubSpot system property
    }
  }
}
```

### Date Handling
```typescript
{
  "tool": "create_deal",
  "arguments": {
    "dealname": "Q4 Deal",
    "closedate": "2024-12-31",  // YYYY-MM-DD format
    "additionalProperties": {
      "hs_createdate": "2024-01-01T00:00:00.000Z"  // ISO format
    }
  }
}
```