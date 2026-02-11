/**
 * Dummy Ticket Data for SheetDB Population
 */

import { CreateTicketData } from "./sheetdb";

export const dummyTicketsData: CreateTicketData[] = [
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
    farmer_id: "u2",
    pump_id: "PUMP-GOVN-004",
    category: "Complete Failure",
    assigned_vendor: "NA",
    expected_resolution_date: "2024-02-05",
    sla_hours: 24,
    escalation_level: 1,
  },
  {
    farmer_id: "u1",
    pump_id: "PUMP-RATU-005",
    category: "Capacity Upgrade Request",
    assigned_vendor: "Green Energy Solutions",
    expected_resolution_date: "2024-02-20",
    sla_hours: 72,
    escalation_level: 0,
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
  {
    farmer_id: "u6",
    pump_id: "PUMP-BABA-008",
    category: "Panel Cleaning Required",
    assigned_vendor: "Green Energy Solutions",
    expected_resolution_date: "2024-02-22",
    sla_hours: 72,
    escalation_level: 0,
  },
  {
    farmer_id: "u7",
    pump_id: "PUMP-DUMK-009",
    category: "Wire Damage",
    assigned_vendor: "Solar Tech India",
    expected_resolution_date: "2024-02-25",
    sla_hours: 12,
    escalation_level: 2,
  },
  {
    farmer_id: "u8",
    pump_id: "PUMP-MORA-010",
    category: "Controller Malfunction",
    assigned_vendor: "NA",
    expected_resolution_date: "2024-02-28",
    sla_hours: 48,
    escalation_level: 0,
  },
  {
    farmer_id: "u9",
    pump_id: "PUMP-SIMD-011",
    category: "Sensor Not Working",
    assigned_vendor: "Eco Power Systems",
    expected_resolution_date: "2024-03-01",
    sla_hours: 24,
    escalation_level: 1,
  },
  {
    farmer_id: "u10",
    pump_id: "PUMP-DALT-012",
    category: "Lights Flickering",
    assigned_vendor: "Sunrise Energy",
    expected_resolution_date: "2024-03-05",
    sla_hours: 72,
    escalation_level: 0,
  },
  {
    farmer_id: "u11",
    pump_id: "PUMP-LATH-013",
    category: "Inverter Noise",
    assigned_vendor: "Green Energy Solutions",
    expected_resolution_date: "2024-03-08",
    sla_hours: 24,
    escalation_level: 1,
  },
  {
    farmer_id: "u12",
    pump_id: "PUMP-GUML-014",
    category: "Power Outage",
    assigned_vendor: "Solar Tech India",
    expected_resolution_date: "2024-03-10",
    sla_hours: 12,
    escalation_level: 2,
  },
  {
    farmer_id: "u13",
    pump_id: "PUMP-CHAI-015",
    category: "Low Water Discharge",
    assigned_vendor: "NA",
    expected_resolution_date: "2024-03-12",
    sla_hours: 48,
    escalation_level: 0,
  },
];

export function generateMoreDummyTickets(count: number): CreateTicketData[] {
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
  
  const categories = [
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
  ];
  
  const vendors = ["Green Energy Solutions", "Solar Tech India", "Eco Power Systems", "Sunrise Energy", "NA"];

  const tickets: CreateTicketData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const farmerNum = Math.floor(Math.random() * 100) + 1;
    const districtIndex = Math.floor(Math.random() * districts.length);
    const district = districts[districtIndex];
    const pumpList = pumpIds[district as keyof typeof pumpIds] || [`PUMP-${district.substring(0, 4).toUpperCase()}-${String(i + 1).padStart(3, '0')}`];
    const pump_id = pumpList[Math.floor(Math.random() * pumpList.length)];
    
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
      category: categories[Math.floor(Math.random() * categories.length)],
      assigned_vendor: vendors[Math.floor(Math.random() * vendors.length)],
      expected_resolution_date: dueDate.toISOString().split('T')[0],
      sla_hours: slaHours,
      escalation_level: escalationLevel,
    });
  }

  return tickets;
}
