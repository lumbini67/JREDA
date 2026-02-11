/**
 * SheetDB API Service for Ticket/Grievance Data
 * API Endpoint: https://sheetdb.io/api/v1/uj1y32yara8fx
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/uj1y32yara8fx";

export interface SheetDBTicket {
  grievance_id: string;
  farmer_id: string;
  pump_id: string;
  category: string;
  created_date: string;
  sla_hours: number;
  current_status: string; // Allow any string since SheetDB can return "Open", "In Progress", "Escalated", etc.
  assigned_vendor: string;
  expected_resolution_date: string;
  escalation_level: number;
  updated_date: string;
  // Legacy fields for backward compatibility
  id?: string;
  userId?: string;
  userName?: string;
  userMobile?: string;
  userEmail?: string;
  district?: string;
  site?: string;
  dueDate?: string;
  issueDescription?: string;
  priority?: "low" | "medium" | "high" | "critical";
  contractor?: string;
  images?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  deviceId?: string;
  deviceType?: string;
}

export interface CreateTicketData {
  farmer_id: string;
  pump_id: string;
  category: string;
  sla_hours?: number;
  assigned_vendor?: string;
  expected_resolution_date?: string;
  escalation_level?: number;
}

/**
 * GET all tickets from SheetDB
 */
export async function getTickets(): Promise<SheetDBTicket[]> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as SheetDBTicket[];
  } catch (error) {
    console.error("Error fetching tickets from SheetDB:", error);
    throw error;
  }
}

/**
 * GET a single ticket by ID
 */
export async function getTicketById(id: string): Promise<SheetDBTicket | null> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/search?grievance_id=${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.length > 0 ? (data[0] as SheetDBTicket) : null;
  } catch (error) {
    console.error("Error fetching ticket from SheetDB:", error);
    throw error;
  }
}
function generateGrievanceId() {
  const timestamp = Date.now(); // unique time
  const random = Math.floor(Math.random() * 1000);

  return `GRV${timestamp}${random}`;
}


/**
 * POST a new ticket to SheetDB
 */
export async function createTicket(ticketData: CreateTicketData): Promise<SheetDBTicket> {
  try {
    const now = new Date().toISOString();
    const ticketCount = await getTicketCount();
    
    const newTicket: SheetDBTicket = {
      grievance_id: generateGrievanceId(),
      farmer_id: ticketData.farmer_id,
      pump_id: ticketData.pump_id,
      category: ticketData.category,
      created_date: now,
      sla_hours: ticketData.sla_hours || 24,
      current_status: "Pending",
      assigned_vendor: ticketData.assigned_vendor || "NA",
      expected_resolution_date: ticketData.expected_resolution_date || "",
      escalation_level: ticketData.escalation_level || 0,
      updated_date: now,
    };

    const response = await fetch(`${SHEETDB_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newTicket]),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Ticket created successfully:", data);
    return newTicket;
  } catch (error) {
    console.error("Error creating ticket in SheetDB:", error);
    throw error;
  }
}

/**
 * POST multiple tickets (for dummy data)
 */
export async function createMultipleTickets(tickets: CreateTicketData[]): Promise<SheetDBTicket[]> {
  try {
    const existingCount = await getTicketCount();

    const ticketsWithIds = tickets.map((ticket, index) => {
      const now = new Date().toISOString();
      return {
        grievance_id: `G${String(existingCount + index + 1).padStart(3, "0")}`,
        farmer_id: ticket.farmer_id,
        pump_id: ticket.pump_id,
        category: ticket.category,
        created_date: now,
        sla_hours: ticket.sla_hours || 24,
        current_status: "Pending" as const,
        assigned_vendor: ticket.assigned_vendor || "NA",
        expected_resolution_date: ticket.expected_resolution_date || "",
        escalation_level: ticket.escalation_level || 0,
        updated_date: now,
      };
    });

    const response = await fetch(`${SHEETDB_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketsWithIds),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Multiple tickets created successfully:", data);
    return ticketsWithIds;
  } catch (error) {
    console.error("Error creating multiple tickets in SheetDB:", error);
    throw error;
  }
}

/**
 * PUT (update) a ticket by ID
 */
export async function updateTicket(id: string, updates: Partial<SheetDBTicket>): Promise<void> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/grievance_id/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updates,
        updated_date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Ticket updated successfully:", data);
  } catch (error) {
    console.error("Error updating ticket in SheetDB:", error);
    throw error;
  }
}

/**
 * DELETE a ticket by ID
 */
export async function deleteTicket(id: string): Promise<void> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/grievance_id/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Ticket deleted successfully:", data);
  } catch (error) {
    console.error("Error deleting ticket from SheetDB:", error);
    throw error;
  }
}

/**
 * Get ticket count
 */
export async function getTicketCount(): Promise<number> {
  try {
    const tickets = await getTickets();
    return tickets.length;
  } catch {
    return 0;
  }
}

/**
 * Search tickets by district (using pump_id as fallback)
 */
export async function getTicketsByDistrict(district: string): Promise<SheetDBTicket[]> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/search?district=${encodeURIComponent(district)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as SheetDBTicket[];
  } catch (error) {
    console.error("Error searching tickets by district:", error);
    throw error;
  }
}

/**
 * Search tickets by status
 */
export async function getTicketsByStatus(status: string): Promise<SheetDBTicket[]> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/search?current_status=${encodeURIComponent(status)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as SheetDBTicket[];
  } catch (error) {
    console.error("Error searching tickets by status:", error);
    throw error;
  }
}
