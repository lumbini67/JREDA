import { createContext, useContext, useState, useEffect, ReactNode } from "react"; 
import emailjs from '@emailjs/browser';

import { 
  getTickets as fetchTicketsFromSheetDB, 
  createTicket as createTicketInSheetDB,
  updateTicket as updateTicketInSheetDB,
  type CreateTicketData,
  type SheetDBTicket
} from "@/services/sheetdb";
import { dummyTicketsData, generateMoreDummyTickets, categoriesByMachineType } from "@/services/dummyTickets";
import { MachineType } from "./AuthContext"; 

// Support both old and new status values from SheetDB
export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed" | "escalated";

// Utility function to parse different date formats
export const parseDate = (dateValue: string | number | undefined): string => {
  if (!dateValue) return "";
  
  // If it's a number, it's likely an Excel serial date
  if (typeof dateValue === 'number') {
    // Excel serial date: days since 1900-01-01 (with leap year bug)
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }
  
  const dateStr = String(dateValue).trim();
  
  // If it's already a valid ISO date, return as is
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr;
  }
  
  // Handle dd/mm/yyyy format
  if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    const parts = dateStr.split('/');
    // Assuming dd/mm/yyyy format
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  
  // Try native Date parsing as fallback
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString();
  }
  
  return "";
};

// Category to machine type mapping
export const categoryToMachineType: Record<string, MachineType> = {
  // Solar Pump categories
  "Solar Pumps": "solar_pump",
  "Solar Pump": "solar_pump",
  "Pump Not Working": "solar_pump",
  "Inverter Error": "solar_pump",
  "Power Fluctuation": "solar_pump",
  "Complete Failure": "solar_pump",
  "Capacity Upgrade Request": "solar_pump",
  "Panel Cleaning Required": "solar_pump",
  "Battery Not Charging": "solar_pump",
  "Wire Damage": "solar_pump",
  "Controller Malfunction": "solar_pump",
  "Sensor Not Working": "solar_pump",
  "Lights Flickering": "solar_pump",
  "Inverter Noise": "solar_pump",
  "Power Outage": "solar_pump",
  "Low Water Discharge": "solar_pump",
  "Motor Burning Smell": "solar_pump",
  "Pipeline Leakage": "solar_pump",
  "Pressure Gauge Fault": "solar_pump",
  "Solar Panel Damage": "solar_pump",
  "Fuse Blown": "solar_pump",
  "MCB Tripping": "solar_pump",
  
  // Mini Grid categories
  "Grid Connection Issue": "mini_grid",
  "Transformer Fault": "mini_grid",
  "Distribution Line Problem": "mini_grid",
  "Meter Reading Error": "mini_grid",
  "Voltage Fluctuation": "mini_grid",
  "Load Balancing Issue": "mini_grid",
  "Phase Failure": "mini_grid",
  "Overheating Equipment": "mini_grid",
  "Protection Relay Trip": "mini_grid",
  "Battery Bank Issue": "mini_grid",
  "Inverter Overload": "mini_grid",
  "Line Theft": "mini_grid",
  "Safety Switch Fault": "mini_grid",
  "Frequency Issue": "mini_grid",
  "Harmonic Distortion": "mini_grid",
  "Grounding Problem": "mini_grid",
  "Switchgear Fault": "mini_grid",
  "Cable Damage": "mini_grid",
  "Substation Issue": "mini_grid",
  "Power Quality Issue": "mini_grid",
  
  // Rooftop Solar categories
  "Panel Shading Issue": "rooftop_solar",
  "Rooftop Structure Damage": "rooftop_solar",
  "Inverter Communication Error": "rooftop_solar",
  "Monitoring System Down": "rooftop_solar",
  "Net Metering Issue": "rooftop_solar",
  "AC Disconnect Fault": "rooftop_solar",
  "DC Combiner Box Issue": "rooftop_solar",
  "Surge Protector Fault": "rooftop_solar",
  "Panel Hotspot": "rooftop_solar",
  "Microcrack in Cells": "rooftop_solar",
  "Junction Box Issue": "rooftop_solar",
  "Enclosure Damage": "rooftop_solar",
  "Bypass Diode Failure": "rooftop_solar",
  "Optimizer Fault": "rooftop_solar",
  "Warranty Claim": "rooftop_solar",
  "Performance Degradation": "rooftop_solar",
  "Bird Nesting Issue": "rooftop_solar",
  "Wind Damage": "rooftop_solar",
  "Corrosion on Mounting": "rooftop_solar",
  "Theft Damage": "rooftop_solar",
};

// Check if a category belongs to a specific machine type
export const isCategoryForMachineType = (category: string, machineType: MachineType): boolean => {
  return categoryToMachineType[category] === machineType;
};

// Map SheetDB status values to our TicketStatus type
const mapStatusToTicketStatus = (status: string | undefined): TicketStatus => {
  const normalizedStatus = status?.toLowerCase().trim();
  switch (normalizedStatus) {
    case "open":
    case "pending":
      return "pending";
    case "in progress":
    case "in_progress":
      return "in_progress";
    case "escalated":
      return "escalated";
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    default:
      return "pending"; // Default to pending for unknown values
  }
};

// Map our TicketStatus back to SheetDB values
const mapTicketStatusToSheetDB = (status: TicketStatus): string => {
  switch (status) {
    case "in_progress":
      return "In Progress";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export interface Ticket {
  grievance_id: string;
  farmer_id: string;
  pump_id: string;
  category: string;
  issue_summary: string;
  email: string;
  created_date: string;
  sla_hours: number;
  current_status: TicketStatus;
  assigned_vendor: string;
  expected_resolution_date: string;
  escalation_level: number;
  updated_date: string;
}

// Convert SheetDBTicket to Ticket
const convertToTicket = (sheetTicket: SheetDBTicket): Ticket => ({
  grievance_id: sheetTicket.grievance_id || sheetTicket.id || "",
  farmer_id: sheetTicket.farmer_id || sheetTicket.userId || "",
  pump_id: sheetTicket.pump_id || sheetTicket.site || sheetTicket.deviceId || "",
  category: sheetTicket.category || sheetTicket.issueDescription || "",
  issue_summary: sheetTicket.issue_summary || "",
  email: sheetTicket.email || sheetTicket.userEmail || "",
  created_date: sheetTicket.created_date || sheetTicket.createdAt || "",
  sla_hours: sheetTicket.sla_hours || 24,
  current_status: mapStatusToTicketStatus(sheetTicket.current_status || sheetTicket.status),
  assigned_vendor: sheetTicket.assigned_vendor || sheetTicket.contractor || "NA",
  expected_resolution_date: parseDate(sheetTicket.expected_resolution_date || sheetTicket.dueDate),
  escalation_level: sheetTicket.escalation_level || 0,
  updated_date: sheetTicket.updated_date || sheetTicket.updatedAt || "",
});

// Convert Ticket to CreateTicketData for SheetDB
const convertToCreateData = (ticket: Omit<Ticket, "grievance_id" | "created_date" | "updated_date" | "current_status">): CreateTicketData => ({
  farmer_id: ticket.farmer_id,
  pump_id: ticket.pump_id,
  category: ticket.category,
  email: ticket.email,
  sla_hours: ticket.sla_hours,
  assigned_vendor: ticket.assigned_vendor,
  expected_resolution_date: ticket.expected_resolution_date,
  escalation_level: ticket.escalation_level,
});

interface GrievanceContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "grievance_id" | "created_date" | "updated_date" | "current_status">) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<void>;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByMachineType: (machineType: MachineType) => Ticket[];
  getTicketById: (ticketId: string) => Ticket | undefined;
  sendEmailNotification: (ticket: Ticket) => void;
  refreshTickets: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const GrievanceContext = createContext<GrievanceContextType | undefined>(undefined);

export function GrievanceProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize EmailJS
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey && publicKey !== "your_public_key") {
      emailjs.init(publicKey);
      console.log("✅ EmailJS initialized");
    } else {
      console.warn("⚠️ EmailJS public key not found in environment variables");
    }
  }, []);

  // Fetch tickets from SheetDB on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        let data = await fetchTicketsFromSheetDB();
        
        // Only populate dummy data if no tickets exist
        if (data.length === 0) {
          console.log("📝 No tickets found in SheetDB. Populating with dummy tickets...");
          
          // Add initial dummy tickets
          await createMultipleTicketsToSheetDB(dummyTicketsData);
          
          // Generate and add more tickets
          const moreTickets = generateMoreDummyTickets(100);
          await createMultipleTicketsToSheetDB(moreTickets);
          
          // Fetch again after populating
          data = await fetchTicketsFromSheetDB();
        } else {
          console.log(`📝 Found ${data.length} tickets in SheetDB.`);
        }
        
        const sortedTickets = data.map(convertToTicket).sort(
          (a, b) => new Date(b.updated_date || 0).getTime() - new Date(a.updated_date || 0).getTime()
        );
        setTickets(sortedTickets);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tickets from SheetDB:", err);
        setError("Failed to load tickets. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Helper function to create multiple tickets in SheetDB
  const createMultipleTicketsToSheetDB = async (tickets: CreateTicketData[]) => {
    const now = new Date().toISOString();
    const existingCount = (await fetchTicketsFromSheetDB()).length;

    const ticketsWithIds = tickets.map((ticket, index) => ({
      grievance_id: `G${String(existingCount + index + 1).padStart(3, "0")}`,
      farmer_id: ticket.farmer_id,
      pump_id: ticket.pump_id,
      category: ticket.category,
      email: ticket.email || "",
      created_date: now,
      sla_hours: ticket.sla_hours || 24,
      current_status: "Pending" as const,
      assigned_vendor: ticket.assigned_vendor || "NA",
      expected_resolution_date: ticket.expected_resolution_date,
      escalation_level: ticket.escalation_level || 0,
      updated_date: now,
    }));

    const response = await fetch("https://sheetdb.io/api/v1/uj1y32yara8fx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketsWithIds),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`✅ Created ${ticketsWithIds.length} tickets in SheetDB`);
  };

  const addTicket = async (ticketData: Omit<Ticket, "grievance_id" | "created_date" | "updated_date" | "current_status">): Promise<Ticket> => {
    try {
      setError(null);
      const createData = convertToCreateData(ticketData);
      const newTicket = await createTicketInSheetDB(createData);
      const ticket = convertToTicket(newTicket);
      
      // Update local state
      setTickets((prev) => {
        const updated = [ticket, ...prev];
        return updated.sort(
          (a, b) => new Date(b.updated_date || 0).getTime() - new Date(a.updated_date || 0).getTime()
        );
      });
      
      return ticket;
    } catch (err) {
      console.error("Failed to create ticket in SheetDB:", err);
      throw err;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      setError(null);
      const sheetDBStatus = mapTicketStatusToSheetDB(status);
      await updateTicketInSheetDB(ticketId, { current_status: sheetDBStatus, updated_date: new Date().toISOString() });
      
      // Update local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.grievance_id === ticketId
            ? { ...ticket, current_status: status, updated_date: new Date().toISOString() }
            : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update ticket status in SheetDB:", err);
      throw err;
    }
  };

  const updateTicket = async (ticketId: string, updates: Partial<Ticket>) => {
    try {
      setError(null);
      
      // Convert status to SheetDB format if present
      const sheetUpdates: Partial<SheetDBTicket> = {
        ...updates,
        updated_date: new Date().toISOString(),
      };
      
      if (updates.current_status) {
        sheetUpdates.current_status = mapTicketStatusToSheetDB(updates.current_status);
      }
      
      await updateTicketInSheetDB(ticketId, sheetUpdates);
      
      // Update local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.grievance_id === ticketId
            ? { ...ticket, ...updates, updated_date: new Date().toISOString() }
            : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update ticket in SheetDB:", err);
      throw err;
    }
  };

  const getTicketsByUser = (userId: string): Ticket[] => {
    return tickets.filter((ticket) => ticket.farmer_id === userId);
  };

  const getTicketsByMachineType = (machineType: MachineType): Ticket[] => {
    return tickets.filter((ticket) => isCategoryForMachineType(ticket.category, machineType));
  };

  const getTicketById = (ticketId: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.grievance_id === ticketId);
  };

  const sendEmailNotification = async (ticket: Ticket) => {
    // EmailJS configuration - Replace these with your actual EmailJS credentials
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "your_service_id";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "grievance_confirmation";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "your_public_key";

    // Don't send email if no email is provided
    if (!ticket.email || !ticket.email.includes("@")) {
      console.log(`No valid email for grievance ${ticket.grievance_id}, skipping email notification`);
      return;
    }

    try {
      console.log("📧 Sending email notification for grievance:", ticket);
      console.log("Using EmailJS config:", { serviceId, templateId, publicKey });
      const templateParams = {
            to_email: ticket.email,
            farmer_name: `Farmer ${ticket.farmer_id}`,
            grievance_id: ticket.grievance_id,
            pump_id: ticket.pump_id,
            category: ticket.category,
            status: ticket.current_status,
            created_date: new Date(ticket.created_date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            assigned_vendor: ticket.assigned_vendor,
            expected_resolution: ticket.expected_resolution_date 
              ? new Date(ticket.expected_resolution_date).toLocaleDateString("en-IN")
              : "Within 24 hours"
          };


      const res = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      console.log("response from EmailJS:", res);
      console.log(`✅ Email notification sent successfully for grievance ${ticket.grievance_id} to ${ticket.email}`);
    } catch (error) {
      console.error(`❌ Failed to send email notification for grievance ${ticket.grievance_id}:`, error);
      // Don't throw error - email is secondary functionality
    }
  };

  const refreshTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTicketsFromSheetDB();
      const sortedTickets = data.map(convertToTicket).sort(
        (a, b) => new Date(b.updated_date || 0).getTime() - new Date(a.updated_date || 0).getTime()
      );
      setTickets(sortedTickets);
    } catch (err) {
      console.error("Failed to refresh tickets from SheetDB:", err);
      setError("Failed to refresh tickets. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GrievanceContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        updateTicket,
        getTicketsByUser,
        getTicketsByMachineType,
        getTicketById,
        sendEmailNotification,
        refreshTickets,
        isLoading,
        error,
      }}
    >
      {children}
    </GrievanceContext.Provider>
  );
}

export function useGrievance() {
  const context = useContext(GrievanceContext);
  if (!context) {
    throw new Error("useGrievance must be used within a GrievanceProvider");
  }
  return context;
}
