/**
 * Script to populate SheetDB with 50 additional dummy tickets
 * Run this script to add 50 new tickets to your Google Sheet via SheetDB API
 * 
 * Usage:
 *   node scripts/populate-50-tickets.js
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/uj1y32yara8fx";

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
const priorities = ["low", "medium", "high", "critical"];

function generateTicket(id) {
  const district = districts[Math.floor(Math.random() * districts.length)];
  const siteList = sites[district] || [district];
  const site = siteList[Math.floor(Math.random() * siteList.length)];
  const daysAgo = Math.floor(Math.random() * 60);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const dueDate = new Date(createdDate);
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

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
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    contractor: contractors[Math.floor(Math.random() * contractors.length)],
    images: "",
    status: "pending",
    createdAt: createdDate.toISOString(),
    updatedAt: createdDate.toISOString(),
    deviceId: `d${Math.floor(Math.random() * 10) + 1}`,
    deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
  };
}

async function populate50Tickets() {
  console.log("🚀 Starting to populate 50 tickets in SheetDB...\n");

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
    const startId = existingTickets.length + 1;
    
    console.log(`📊 Found ${existingTickets.length} existing tickets.`);
    console.log(`📝 Will add tickets from T${String(startId).padStart(3, "0")} to T${String(startId + 49).padStart(3, "0")}\n`);

    // Generate 50 new tickets
    const newTickets = [];
    for (let i = 0; i < 50; i++) {
      newTickets.push(generateTicket(startId + i));
    }

    // Send to SheetDB
    const createResponse = await fetch(SHEETDB_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTickets),
    });

    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    const result = await createResponse.json();
    console.log("✅ Successfully created 50 tickets!");
    console.log(`📋 Created IDs: ${newTickets.map(t => t.id).join(", ")}`);
    console.log(`\n🎉 SheetDB now has ${existingTickets.length + 50} total tickets.`);
    
  } catch (error) {
    console.error("❌ Error populating SheetDB:", error);
    process.exit(1);
  }
}

populate50Tickets();
