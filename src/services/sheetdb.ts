/**
 * SheetDB API Service for Ticket/Grievance Data
 * API Endpoint: https://sheetdb.io/api/v1/jv9mggt5mkged
 */

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/jv9mggt5mkged";

export interface SheetDBTicket {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  userEmail: string;
  district: string;
  site: string;
  dueDate: string;
  issueDescription: string;
  priority: "low" | "medium" | "high" | "critical";
  contractor: string;
  images: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  deviceId?: string;
  deviceType?: string;
}

export interface CreateTicketData {
  userId: string;
  userName: string;
  userMobile: string;
  userEmail: string;
  district: string;
  site: string;
  dueDate: string;
  issueDescription: string;
  priority: "low" | "medium" | "high" | "critical";
  contractor: string;
  images?: string[];
  deviceId?: string;
  deviceType?: string;
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
    const response = await fetch(`${SHEETDB_API_URL}/search?id=${encodeURIComponent(id)}`, {
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

/**
 * POST a new ticket to SheetDB
 */
export async function createTicket(ticketData: CreateTicketData): Promise<SheetDBTicket> {
  try {
    const now = new Date().toISOString();
    const ticketCount = await getTicketCount();
    
    const newTicket: SheetDBTicket = {
      id: `T${String(ticketCount + 1).padStart(3, "0")}`,
      userId: ticketData.userId,
      userName: ticketData.userName,
      userMobile: ticketData.userMobile,
      userEmail: ticketData.userEmail,
      district: ticketData.district,
      site: ticketData.site,
      dueDate: ticketData.dueDate,
      issueDescription: ticketData.issueDescription,
      priority: ticketData.priority,
      contractor: ticketData.contractor,
      images: ticketData.images?.join(",") || "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
      deviceId: ticketData.deviceId || "",
      deviceType: ticketData.deviceType || "",
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
    const now = new Date().toISOString();
    const existingCount = await getTicketCount();

    const ticketsWithIds = tickets.map((ticket, index) => {
      const now = new Date().toISOString();
      return {
        id: `T${String(existingCount + index + 1).padStart(3, "0")}`,
        userId: ticket.userId,
        userName: ticket.userName,
        userMobile: ticket.userMobile,
        userEmail: ticket.userEmail,
        district: ticket.district,
        site: ticket.site,
        dueDate: ticket.dueDate,
        issueDescription: ticket.issueDescription,
        priority: ticket.priority,
        contractor: ticket.contractor,
        images: ticket.images?.join(",") || "",
        status: "pending" as const,
        createdAt: now,
        updatedAt: now,
        deviceId: ticket.deviceId || "",
        deviceType: ticket.deviceType || "",
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
    const response = await fetch(`${SHEETDB_API_URL}/id/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString(),
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
    const response = await fetch(`${SHEETDB_API_URL}/id/${encodeURIComponent(id)}`, {
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
 * Search tickets by district
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
export async function getTicketsByStatus(status: "pending" | "in_progress" | "resolved" | "closed"): Promise<SheetDBTicket[]> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/search?status=${encodeURIComponent(status)}`, {
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
