/**
 * Script to send dummy ticket data to SheetDB
 * Run with: node scripts/sendDummyData.js
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/jv9mggt5mkged";

// Dummy ticket data matching your sheet columns
const dummyTickets = [
  {
    id: "T001",
    userId: "u1",
    userName: "Rajesh Kumar",
    userMobile: "9876543210",
    userEmail: "rajesh.kumar@gmail.com",
    district: "Ranchi",
    site: "Kanke Village",
    dueDate: "2024-02-15",
    issueDescription: "Solar Pump - Kanke: Pump not working since morning. Motor makes unusual noise.",
    priority: "high",
    contractor: "Green Energy Solutions",
    images: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d1",
    deviceType: "solar_pump"
  },
  {
    id: "T002",
    userId: "u2",
    userName: "Priya Devi",
    userMobile: "9876543211",
    userEmail: "priya.devi@gmail.com",
    district: "Dhanbad",
    site: "Jharia Town",
    dueDate: "2024-02-10",
    issueDescription: "Rooftop Solar - Jharia: Inverter showing error code E05. Power output reduced by 50%.",
    priority: "medium",
    contractor: "NA",
    images: "",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d3",
    deviceType: "rooftop_solar"
  },
  {
    id: "T003",
    userId: "u3",
    userName: "Amit Singh",
    userMobile: "9876543212",
    userEmail: "amit.singh@gmail.com",
    district: "Bokaro",
    site: "Sector 4",
    dueDate: "2024-02-08",
    issueDescription: "Mini Grid - Sector 4: Frequent power fluctuations affecting connected households.",
    priority: "critical",
    contractor: "Solar Tech India",
    images: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d6",
    deviceType: "mini_grid"
  },
  {
    id: "T004",
    userId: "u2",
    userName: "Priya Devi",
    userMobile: "9876543211",
    userEmail: "priya.devi@gmail.com",
    district: "Dhanbad",
    site: "Govindpur",
    dueDate: "2024-02-05",
    issueDescription: "High Mast - Govindpur: All lights not working. Complete failure.",
    priority: "high",
    contractor: "NA",
    images: "",
    status: "resolved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d4",
    deviceType: "high_mast"
  },
  {
    id: "T005",
    userId: "u1",
    userName: "Rajesh Kumar",
    userMobile: "9876543210",
    userEmail: "rajesh.kumar@gmail.com",
    district: "Ranchi",
    site: "Ratu Block",
    dueDate: "2024-02-20",
    issueDescription: "Mini Grid - Ratu: Request for capacity upgrade. Current system insufficient for village needs.",
    priority: "low",
    contractor: "Green Energy Solutions",
    images: "",
    status: "closed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d2",
    deviceType: "mini_grid"
  },
  {
    id: "T006",
    userId: "u4",
    userName: "Sita Devi",
    userMobile: "9876543213",
    userEmail: "sita.devi@gmail.com",
    district: "Hazaribagh",
    site: "Ramgarh Road",
    dueDate: "2024-02-12",
    issueDescription: "Street Light - Ramgarh: LED panel damaged, needs replacement.",
    priority: "medium",
    contractor: "Eco Power Systems",
    images: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d7",
    deviceType: "street_light"
  },
  {
    id: "T007",
    userId: "u5",
    userName: "Mohan Prasad",
    userMobile: "9876543214",
    userEmail: "mohan.prasad@gmail.com",
    district: "Giridih",
    site: "Giridih Town",
    dueDate: "2024-02-18",
    issueDescription: "Solar Pump - Giridih: Battery not charging properly. Voltage dropping frequently.",
    priority: "high",
    contractor: "Sunrise Energy",
    images: "",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d8",
    deviceType: "solar_pump"
  },
  {
    id: "T008",
    userId: "u6",
    userName: "Lakshmi Oraon",
    userMobile: "9876543215",
    userEmail: "lakshmi.oraon@gmail.com",
    district: "Deoghar",
    site: "Baba Dham",
    dueDate: "2024-02-22",
    issueDescription: "Rooftop Solar - Deoghar: Solar panels covered with dust and debris. Cleaning required.",
    priority: "low",
    contractor: "Green Energy Solutions",
    images: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d9",
    deviceType: "rooftop_solar"
  },
  {
    id: "T009",
    userId: "u7",
    userName: "Birsa Munda",
    userMobile: "9876543216",
    userEmail: "birsa.munda@gmail.com",
    district: "Dumka",
    site: "Dumka Town",
    dueDate: "2024-02-25",
    issueDescription: "Mini Grid - Dumka: Connection wire damaged by animals. Immediate repair needed.",
    priority: "critical",
    contractor: "Solar Tech India",
    images: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d10",
    deviceType: "mini_grid"
  },
  {
    id: "T010",
    userId: "u8",
    userName: "Dhananjay Ray",
    userMobile: "9876543217",
    userEmail: "dhananjay.ray@gmail.com",
    district: "Ranchi",
    site: "Morabadi",
    dueDate: "2024-02-28",
    issueDescription: "Controller - Morabadi: Controller malfunctioning. Display showing wrong values.",
    priority: "medium",
    contractor: "NA",
    images: "",
    status: "in_progress",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deviceId: "d11",
    deviceType: "solar_pump"
  }
];

async function sendDummyData() {
  console.log("🚀 Sending dummy data to SheetDB...");
  console.log("📡 API URL:", SHEETDB_API_URL);
  console.log("📊 Number of tickets:", dummyTickets.length);
  console.log("");

  try {
    const response = await fetch(SHEETDB_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dummyTickets),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Success! Data sent to SheetDB.");
    console.log("📋 Response:", JSON.stringify(data, null, 2));
    console.log("");
    console.log("🎉 Your tickets are now in Google Sheets!");
  } catch (error) {
    console.error("❌ Error sending data:", error.message);
    process.exit(1);
  }
}

sendDummyData();
