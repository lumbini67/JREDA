/**
 * Script to add 30 tickets for each status to SheetDB
 * Adds: 30 pending, 30 in_progress, 30 resolved, 30 closed
 * Total: 120 new tickets
 * 
 * Usage:
 *   node scripts/add-30-each-status.js
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/jv9mggt5mkged";

const districts = ["Ranchi", "Dhanbad", "Bokaro", "Jamshedpur", "Hazaribagh", "Giridih", "Deoghar", "Dumka"];
const sites = {
  "Ranchi": ["Kanke Village", "Ratu Block", "Morabadi", "Harmu", "Kokra"],
  "Dhanbad": ["Jharia Town", "Govindpur", "Bhuli", "Katras", "Sijua"],
  "Bokaro": ["Sector 4", "Sector 12", "Jhapsali", "Chas", "Petarwar"],
  "Jamshedpur": ["Sakchi", "Bistupur", "Sonari", "Kadma", "Jugsalai"],
  "Hazaribagh": ["Ramgarh Road", "Centre Market", "Hasanpur", "Katkamdag", "Bishungarh"],
  "Giridih": ["Giridih Town", "Tisri", "Dhanwar", "Gawan", "Bagodar"],
  "Deoghar": ["Baba Dham", "Sapha", "Chandra Mohan", "Rohini", "Mohanpur"],
  "Dumka": ["Dumka Town", "Jama", "Shikaripara", "Raneshwar", "Masanjor"],
};
const deviceTypes = ["solar_pump", "rooftop_solar", "mini_grid", "high_mast", "street_light"];
const contractors = ["Green Energy Solutions", "Solar Tech India", "NA", "Eco Power Systems", "Sunrise Energy"];
const issues = [
  "Pump not working since morning. Motor makes unusual noise.",
  "Inverter showing error code E05. Power output reduced by 50%.",
  "Frequent power fluctuations affecting connected households.",
  "All lights not working. Complete failure.",
  "Request for capacity upgrade. Current system insufficient for village needs.",
  "Solar panels covered with dust and debris. Cleaning required.",
  "Battery not charging properly. Voltage dropping frequently.",
  "Connection wire damaged by animals. Immediate repair needed.",
  "Controller malfunctioning. Display showing wrong values.",
  "Water level sensor not working. Automatic switch failing.",
];

function generateTicket(id, status, priority = "medium") {
  const district = districts[Math.floor(Math.random() * districts.length)];
  const siteList = sites[district] || [district];
  const site = siteList[Math.floor(Math.random() * siteList.length)];
  const daysAgo = Math.floor(Math.random() * 60);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const dueDate = new Date(createdDate);
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

  const updatedDate = new Date(createdDate);
  // For resolved/closed, update date is closer to now
  if (status === "resolved" || status === "closed") {
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 3) + 1);
  } else {
    updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 10));
  }

  const userId = `u${Math.floor(Math.random() * 20) + 1}`;
  const userName = `User${Math.floor(Math.random() * 20) + 1}`;
  const userMobile = `9876543${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
  const userEmail = `${userName.toLowerCase()}@gmail.com`;

  return {
    id: `T${String(id).padStart(3, "0")}`,
    userId,
    userName,
    userMobile,
    userEmail,
    district,
    site,
    dueDate: dueDate.toISOString().split('T')[0],
    issueDescription: `Ticket ${id}: ${issues[Math.floor(Math.random() * issues.length)]}`,
    priority,
    contractor: contractors[Math.floor(Math.random() * contractors.length)],
    images: "",
    status,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    deviceId: `d${Math.floor(Math.random() * 10) + 1}`,
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
  };
}

async function add30EachStatus() {
  console.log("🚀 Adding 30 tickets for each status to SheetDB...\n");

  try {
    // Fetch existing tickets to get current count
    const response = await fetch(SHEETDB_API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const existingTickets = await response.json();
    let currentId = existingTickets.length + 1;
    
    console.log(`📊 Found ${existingTickets.length} existing tickets.`);
    
    const newTickets = [];
    const statuses = [
      { status: "pending", count: 30, priorities: ["high", "medium", "low"] },
      { status: "in_progress", count: 30, priorities: ["high", "medium", "low"] },
      { status: "resolved", count: 30, priorities: ["medium", "low", "low"] },
      { status: "closed", count: 30, priorities: ["low", "low", "low"] },
    ];

    for (const statusGroup of statuses) {
      console.log(`\n📝 Creating 30 ${statusGroup.status} tickets...`);
      for (let i = 0; i < statusGroup.count; i++) {
        const priority = statusGroup.priorities[Math.floor(Math.random() * statusGroup.priorities.length)];
        newTickets.push(generateTicket(currentId, statusGroup.status, priority));
        currentId++;
      }
    }

    console.log(`\n✅ Generated ${newTickets.length} new tickets.`);
    console.log(`📝 ID range: T${String(existingTickets.length + 1).padStart(3, "0")} to T${String(currentId - 1).padStart(3, "0")}`);

    // Send to SheetDB in batches of 50 (SheetDB limit)
    console.log("\n📤 Sending to SheetDB...");
    const batchSize = 50;
    for (let i = 0; i < newTickets.length; i += batchSize) {
      const batch = newTickets.slice(i, i + batchSize);
      const createResponse = await fetch(SHEETDB_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });

      if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
      }
      
      console.log(`   ✅ Sent batch ${Math.floor(i / batchSize) + 1}: ${batch.length} tickets`);
    }

    console.log(`\n🎉 Successfully created ${newTickets.length} tickets!`);
    console.log(`🎉 SheetDB now has ${existingTickets.length + newTickets.length} total tickets.`);
    
  } catch (error) {
    console.error("❌ Error adding tickets:", error);
    process.exit(1);
  }
}

add30EachStatus();
