/**
 * Script to populate SheetDB with dummy ticket data
 * Run this script to add initial data to your Google Sheet via SheetDB API
 * 
 * Usage:
 * 1. Import this module and call populateSheetDB() in your app
 * 2. Or run this as a standalone script with: npx ts-node src/services/populateSheetDB.ts
 */

import { dummyTicketsData, generateMoreDummyTickets } from "./dummyTickets";
import { createMultipleTickets, getTickets } from "./sheetdb";

export async function populateSheetDB(additionalCount: number = 0): Promise<void> {
  console.log("🚀 Starting SheetDB population...");

  try {
    // Check if data already exists
    const existingTickets = await getTickets();
    if (existingTickets.length > 0) {
      console.log(`⚠️  Found ${existingTickets.length} existing tickets in SheetDB.`);
      console.log("   Skipping population to avoid duplicates.");
      console.log("   Delete existing data from sheet if you want to repopulate.");
      return;
    }

    // Add initial dummy tickets
    console.log(`📝 Adding ${dummyTicketsData.length} initial tickets...`);
    await createMultipleTickets(dummyTicketsData);

    // Add more generated tickets if requested
    if (additionalCount > 0) {
      console.log(`📝 Generating and adding ${additionalCount} more tickets...`);
      const moreTickets = generateMoreDummyTickets(additionalCount);
      await createMultipleTickets(moreTickets);
    }

    console.log("✅ SheetDB population completed successfully!");
  } catch (error) {
    console.error("❌ Error populating SheetDB:", error);
    throw error;
  }
}

export async function checkSheetDBStatus(): Promise<void> {
  console.log("📊 Checking SheetDB status...");

  try {
    const tickets = await getTickets();
    console.log(`✅ SheetDB is accessible!`);
    console.log(`   Total tickets: ${tickets.length}`);
    
    if (tickets.length > 0) {
      console.log("\n📋 Sample tickets:");
      tickets.slice(0, 3).forEach((ticket, index) => {
        console.log(`   ${index + 1}. [${ticket.id}] ${ticket.district} - ${ticket.issueDescription.substring(0, 50)}...`);
      });
    }
  } catch (error) {
    console.error("❌ Error accessing SheetDB:", error);
  }
}

// Export for use in React components
export { dummyTicketsData, generateMoreDummyTickets };
