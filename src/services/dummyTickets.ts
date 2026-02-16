/**
 * Dummy Ticket Data for SheetDB Population
 * Includes categories for all machine types: solar_pump, mini_grid, rooftop_solar
 */

import { CreateTicketData } from "./sheetdb";

// Categories for each machine type
export const categoriesByMachineType: Record<string, string[]> = {
  solar_pump: [
    "Solar Pumps",
    "Solar Pump",
    "Pump Not Working",
    "Inverter Error",
    "Power Fluctuation",
    "Complete Failure",
    "Capacity Upgrade Request",
    "Panel Cleaning Required",
    "Battery Not Charging",
    "Wire Damage",
    "Controller Malfunction",
    "Sensor Not Working",
    "Lights Flickering",
    "Inverter Noise",
    "Power Outage",
    "Low Water Discharge",
    "Motor Burning Smell",
    "Pipeline Leakage",
    "Pressure Gauge Fault",
    "Solar Panel Damage",
    "Fuse Blown",
    "MCB Tripping",
  ],
  mini_grid: [
    "Grid Connection Issue",
    "Transformer Fault",
    "Distribution Line Problem",
    "Meter Reading Error",
    "Voltage Fluctuation",
    "Load Balancing Issue",
    "Phase Failure",
    "Overheating Equipment",
    "Protection Relay Trip",
    "Battery Bank Issue",
    "Inverter Overload",
    "Line Theft",
    "Safety Switch Fault",
    "Frequency Issue",
    "Harmonic Distortion",
    "Grounding Problem",
    "Switchgear Fault",
    "Cable Damage",
    "Substation Issue",
    "Power Quality Issue",
  ],
  rooftop_solar: [
    "Panel Shading Issue",
    "Rooftop Structure Damage",
    "Inverter Communication Error",
    "Monitoring System Down",
    "Net Metering Issue",
    "AC Disconnect Fault",
    "DC Combiner Box Issue",
    "Surge Protector Fault",
    "Panel Hotspot",
    "Microcrack in Cells",
    "Junction Box Issue",
    "Enclosure Damage",
    "Bypass Diode Failure",
    "Optimizer Fault",
    "Warranty Claim",
    "Performance Degradation",
    "Bird Nesting Issue",
    "Wind Damage",
    "Corrosion on Mounting",
    "Theft Damage",
  ],
};

export const dummyTicketsData: CreateTicketData[] = [
  // Solar Pump tickets
  {
    farmer_id: "u1",
    pump_id: "PUMP-KANK-001",
    category: "Pump Not Working",
    assigned_vendor: "Green Energy Solutions",
    expected_resolution_date: "2024-02-15",
    sla_hours: 24,
    escalation_level: 1,
  },
  {
    farmer_id: "u2",
    pump_id: "PUMP-JHAR-002",
    category: "Inverter Error",
    assigned_vendor: "NA",
    expected_resolution_date: "2024-02-10",
    sla_hours: 48,
    escalation_level: 0,
  },
  {
    farmer_id: "u3",
    pump_id: "PUMP-SEC4-003",
    category: "Power Fluctuation",
    assigned_vendor: "Solar Tech India",
    expected_resolution_date: "2024-02-08",
    sla_hours: 12,
    escalation_level: 2,
  },
  {
    farmer_id: "u4",
    pump_id: "PUMP-RAMG-006",
    category: "LED Panel Damage",
    assigned_vendor: "Eco Power Systems",
    expected_resolution_date: "2024-02-12",
    sla_hours: 48,
    escalation_level: 0,
  },
  {
    farmer_id: "u5",
    pump_id: "PUMP-GIRI-007",
    category: "Battery Not Charging",
    assigned_vendor: "Sunrise Energy",
    expected_resolution_date: "2024-02-18",
    sla_hours: 24,
    escalation_level: 1,
  },
  // Mini Grid tickets
  {
    farmer_id: "u6",
    pump_id: "MGRID-RATU-001",
    category: "Transformer Fault",
    assigned_vendor: "Grid Solutions Ltd",
    expected_resolution_date: "2024-02-20",
    sla_hours: 24,
    escalation_level: 1,
  },
  {
    farmer_id: "u7",
    pump_id: "MGRID-KANK-002",
    category: "Voltage Fluctuation",
    assigned_vendor: "Power Grid Corp",
    expected_resolution_date: "2024-02-18",
    sla_hours: 12,
    escalation_level: 2,
  },
  {
    farmer_id: "u8",
    pump_id: "MGRID-BOKA-003",
    category: "Distribution Line Problem",
    assigned_vendor: "NA",
    expected_resolution_date: "2024-02-22",
    sla_hours: 48,
    escalation_level: 0,
  },
  // Rooftop Solar tickets
  {
    farmer_id: "u9",
    pump_id: "RFTOP-DHAN-001",
    category: "Panel Shading Issue",
    assigned_vendor: "Rooftop Solar Co",
    expected_resolution_date: "2024-02-25",
    sla_hours: 72,
    escalation_level: 0,
  },
  {
    farmer_id: "u10",
    pump_id: "RFTOP-JAMS-002",
    category: "Net Metering Issue",
    assigned_vendor: "Solar Connect",
    expected_resolution_date: "2024-02-28",
    sla_hours: 48,
    escalation_level: 1,
  },
];

export function generateMoreDummyTickets(count: number, machineType?: string): CreateTicketData[] {
  const districts = ["Ranchi", "Dhanbad", "Bokaro", "Jamshedpur", "Hazaribagh", "Giridih", "Deoghar", "Dumka", "Simdega", "Palamu", "Latehar", "Gumla", "Chaibasa"];
  
  const pumpIds: Record<string, string[]> = {
    "Ranchi": ["PUMP-KANK-001", "PUMP-RATU-002", "PUMP-MORA-003", "PUMP-HARM-004", "PUMP-KOKR-005"],
    "Dhanbad": ["PUMP-JHAR-001", "PUMP-GOVN-002", "PUMP-BHUL-003", "PUMP-KATR-004", "PUMP-SIJU-005"],
    "Bokaro": ["PUMP-SEC4-001", "PUMP-SEC12-002", "PUMP-JHAP-003", "PUMP-CHAS-004", "PUMP-PETA-005"],
    "Jamshedpur": ["PUMP-SAKC-001", "PUMP-BIST-002", "PUMP-SONA-003", "PUMP-KADM-004", "PUMP-JUGS-005"],
    "Hazaribagh": ["PUMP-RAMG-001", "PUMP-CENT-002", "PUMP-HASN-003", "PUMP-KATK-004", "PUMP-BISH-005"],
    "Giridih": ["PUMP-GIRI-001", "PUMP-TISR-002", "PUMP-DHAN-003", "PUMP-GAWN-004", "PUMP-BAGO-005"],
    "Deoghar": ["PUMP-BABA-001", "PUMP-SAPH-002", "PUMP-CHAN-003", "PUMP-ROHI-004", "PUMP-MOHN-005"],
    "Dumka": ["PUMP-DUMK-001", "PUMP-JAMA-001", "PUMP-SHIK-002", "PUMP-RANE-003", "PUMP-MASA-005"],
    "Simdega": ["PUMP-SIMD-001", "PUMP-BANO-002", "PUMP-KOLE-003", "PUMP-KURD-004", "PUMP-THET-005"],
    "Palamu": ["PUMP-DALT-001", "PUMP-LATH-002", "PUMP-BARW-003", "PUMP-PANK-004", "PUMP-SATB-005"],
    "Latehar": ["PUMP-LATH-001", "PUMP-BALU-002", "PUMP-BARW-003", "PUMP-MAHA-004", "PUMP-CHAN-005"],
    "Gumla": ["PUMP-GUML-001", "PUMP-BISH-002", "PUMP-BASI-003", "PUMP-GHAG-004", "PUMP-CHA-005"],
    "Chaibasa": ["PUMP-CHAI-001", "PUMP-JHAR-002", "PUMP-ROUR-003", "PUMP-SUND-004", "PUMP-BONA-005"],
  };

  const miniGridIds: Record<string, string[]> = {
    "Ranchi": ["MGRID-RATU-001", "MGRID-KANK-002", "MGRID-ORMA-003", "MGRID-HARM-004"],
    "Dhanbad": ["MGRID-JHAR-001", "MGRID-GOVN-002", "MGRID-BHUL-003", "MGRID-KATR-004"],
    "Bokaro": ["MGRID-SEC4-001", "MGRID-SEC12-002", "MGRID-JHAP-003", "MGRID-CHAS-004"],
    "Jamshedpur": ["MGRID-SAKC-001", "MGRID-BIST-002", "MGRID-SONA-003", "MGRID-KADM-004"],
    "Hazaribagh": ["MGRID-RAMG-001", "MGRID-CENT-002", "MGRID-HASN-003", "MGRID-KATK-004"],
    "Giridih": ["MGRID-GIRI-001", "MGRID-TISR-002", "MGRID-DHAN-003", "MGRID-GAWN-004"],
    "Deoghar": ["MGRID-BABA-001", "MGRID-SAPH-002", "MGRID-CHAN-003", "MGRID-ROHI-004"],
    "Dumka": ["MGRID-DUMK-001", "MGRID-JAMA-001", "MGRID-SHIK-002", "MGRID-RANE-003"],
    "Simdega": ["MGRID-SIMD-001", "MGRID-BANO-002", "MGRID-KOLE-003", "MGRID-KURD-004"],
    "Palamu": ["MGRID-DALT-001", "MGRID-LATH-002", "MGRID-BARW-003", "MGRID-PANK-004"],
    "Latehar": ["MGRID-LATH-001", "MGRID-BALU-002", "MGRID-BARW-003", "MGRID-MAHA-004"],
    "Gumla": ["MGRID-GUML-001", "MGRID-BISH-002", "MGRID-BASI-003", "MGRID-GHAG-004"],
    "Chaibasa": ["MGRID-CHAI-001", "MGRID-JHAR-002", "MGRID-ROUR-003", "MGRID-SUND-004"],
  };

  const rooftopIds: Record<string, string[]> = {
    "Ranchi": ["RFTOP-RAN-001", "RFTOP-RAN-002", "RFTOP-RAN-003", "RFTOP-RAN-004"],
    "Dhanbad": ["RFTOP-DHAN-001", "RFTOP-DHAN-002", "RFTOP-DHAN-003", "RFTOP-DHAN-004"],
    "Bokaro": ["RFTOP-BOKA-001", "RFTOP-BOKA-002", "RFTOP-BOKA-003", "RFTOP-BOKA-004"],
    "Jamshedpur": ["RFTOP-JAMS-001", "RFTOP-JAMS-002", "RFTOP-JAMS-003", "RFTOP-JAMS-004"],
    "Hazaribagh": ["RFTOP-HAZA-001", "RFTOP-HAZA-002", "RFTOP-HAZA-003", "RFTOP-HAZA-004"],
    "Giridih": ["RFTOP-GIRI-001", "RFTOP-GIRI-002", "RFTOP-GIRI-003", "RFTOP-GIRI-004"],
    "Deoghar": ["RFTOP-DEOG-001", "RFTOP-DEOG-002", "RFTOP-DEOG-003", "RFTOP-DEOG-004"],
    "Dumka": ["RFTOP-DUMK-001", "RFTOP-DUMK-002", "RFTOP-DUMK-003", "RFTOP-DUMK-004"],
    "Simdega": ["RFTOP-SIMD-001", "RFTOP-SIMD-002", "RFTOP-SIMD-003", "RFTOP-SIMD-004"],
    "Palamu": ["RFTOP-PALA-001", "RFTOP-PALA-002", "RFTOP-PALA-003", "RFTOP-PALA-004"],
    "Latehar": ["RFTOP-LATE-001", "RFTOP-LATE-002", "RFTOP-LATE-003", "RFTOP-LATE-004"],
    "Gumla": ["RFTOP-GUML-001", "RFTOP-GUML-002", "RFTOP-GUML-003", "RFTOP-GUML-004"],
    "Chaibasa": ["RFTOP-CHAI-001", "RFTOP-CHAI-002", "RFTOP-CHAI-003", "RFTOP-CHAI-004"],
  };

  const vendors = ["Green Energy Solutions", "Solar Tech India", "Eco Power Systems", "Sunrise Energy", "Grid Solutions Ltd", "Power Grid Corp", "Rooftop Solar Co", "Solar Connect", "NA"];

  const tickets: CreateTicketData[] = [];
  const now = new Date();

  // Get categories based on machine type, or all categories if not specified
  let availableCategories: string[];
  if (machineType && categoriesByMachineType[machineType]) {
    availableCategories = categoriesByMachineType[machineType];
  } else {
    // Mix of all categories
    availableCategories = [
      ...categoriesByMachineType.solar_pump.slice(0, 10),
      ...categoriesByMachineType.mini_grid.slice(0, 5),
      ...categoriesByMachineType.rooftop_solar.slice(0, 5),
    ];
  }

  for (let i = 0; i < count; i++) {
    const farmerNum = Math.floor(Math.random() * 100) + 1;
    const districtIndex = Math.floor(Math.random() * districts.length);
    const district = districts[districtIndex];
    
    // Determine device ID based on machine type or mix
    let pump_id: string;
    if (machineType === "mini_grid") {
      const pumpList = miniGridIds[district] || [`MGRID-${district.substring(0, 4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`];
      pump_id = pumpList[Math.floor(Math.random() * pumpList.length)];
    } else if (machineType === "rooftop_solar") {
      const pumpList = rooftopIds[district] || [`RFTOP-${district.substring(0, 4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`];
      pump_id = pumpList[Math.floor(Math.random() * pumpList.length)];
    } else {
      // Default to solar pump or mix
      const pumpList = pumpIds[district] || [`PUMP-${district.substring(0, 4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`];
      pump_id = pumpList[Math.floor(Math.random() * pumpList.length)];
    }
    
    const daysAgo = Math.floor(Math.random() * 60);
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    const dueDate = new Date(createdDate);
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);
    
    const slaHours = [12, 24, 48, 72][Math.floor(Math.random() * 4)];
    const escalationLevel = Math.floor(Math.random() * 3);

    tickets.push({
      farmer_id: `u${farmerNum}`,
      pump_id: pump_id,
      category: availableCategories[Math.floor(Math.random() * availableCategories.length)],
      assigned_vendor: vendors[Math.floor(Math.random() * vendors.length)],
      expected_resolution_date: dueDate.toISOString().split('T')[0],
      sla_hours: slaHours,
      escalation_level: escalationLevel,
    });
  }

  return tickets;
}
