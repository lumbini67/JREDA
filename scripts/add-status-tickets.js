/**
 * Script to add tickets with specific statuses to SheetDB
 * Adds: 3 in_progress, 1 resolved, 1 closed
 * 
 * Usage:
 *   node scripts/add-status-tickets.js
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/s1f7oc6clafd4";

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
  const daysAgo = Math.floor(Math.random() * 30);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);
  
  const dueDate = new Date(createdDate);
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);

  const updatedDate = new Date(createdDate);
  updatedDate.setDate(updatedDate.getDate() + Math.floor(Math.random() * 5) + 1);

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

async function addStatusTickets() {
  console.log("🚀 Adding tickets with specific statuses to SheetDB...\n");

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
    
    // Create tickets with specific statuses
    const newTickets = [
      // 3 in_progress tickets
      generateTicket(startId, "in_progress", "high"),
      generateTicket(startId + 1, "in_progress", "medium"),
      generateTicket(startId + 2, "in_progress", "low"),
      // 1 resolved ticket
      generateTicket(startId + 3, "resolved", "medium"),
      // 1 closed ticket
      generateTicket(startId + 4, "closed", "low"),
    ];

    console.log(`\n📝 Creating tickets:`);
    newTickets.forEach(ticket => {
      console.log(`   - ${ticket.id}: ${ticket.status} (${ticket.priority})`);
    });

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
    console.log("\n✅ Successfully created status tickets!");
    console.log(`🎉 SheetDB now has ${existingTickets.length + 5} total tickets.`);
    
  } catch (error) {
    console.error("❌ Error adding tickets:", error);
    process.exit(1);
  }
}

addStatusTickets();
