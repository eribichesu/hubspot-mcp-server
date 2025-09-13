#!/usr/bin/env node

/**
 * Test script for HubSpot MCP Server
 * This script can be used to manually test the MCP server functionality
 */

import { HubSpotMCPServer } from '../src/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testServer() {
  console.log('🚀 Starting HubSpot MCP Server Test...');
  
  // Check if API key is configured
  if (!process.env.HUBSPOT_API_KEY && !process.env.HUBSPOT_ACCESS_TOKEN) {
    console.error('❌ Error: HUBSPOT_API_KEY or HUBSPOT_ACCESS_TOKEN must be set in .env file');
    console.log('📝 Please copy .env.example to .env and add your HubSpot credentials');
    process.exit(1);
  }

  try {
    const server = new HubSpotMCPServer();
    console.log('✅ Server initialized successfully');
    console.log('📡 Server is ready to accept MCP requests');
    console.log('');
    console.log('Available tools:');
    console.log('  📞 Contacts: get_contacts, get_contact, create_contact, update_contact, search_contacts');
    console.log('  🏢 Companies: get_companies, get_company, create_company, update_company');
    console.log('  💰 Deals: get_deals, get_deal, create_deal, update_deal');
    console.log('  📧 Emails: send_email, get_email_events');
    console.log('');
    console.log('🔧 To use with Claude or other MCP clients, configure the server in your MCP settings');
    
    // Start the server
    await server.run();
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testServer();
}