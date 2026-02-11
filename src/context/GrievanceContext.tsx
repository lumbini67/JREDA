import { createContext, useContext, useState, useEffect, ReactNode } from "react"; 
import { 
  getTickets as fetchTicketsFromSheetDB, 
  createTicket as createTicketInSheetDB,
  updateTicket as updateTicketInSheetDB,
  type CreateTicketData,
  type SheetDBTicket
} from "@/services/sheetdb";
import { dummyTicketsData, generateMoreDummyTickets } from "@/services/dummyTickets";

// Support both old and new status values from SheetDB
export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed" | "escalated";

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
  created_date: sheetTicket.created_date || sheetTicket.createdAt || "",
  sla_hours: sheetTicket.sla_hours || 24,
  current_status: mapStatusToTicketStatus(sheetTicket.current_status || sheetTicket.status),
  assigned_vendor: sheetTicket.assigned_vendor || sheetTicket.contractor || "NA",
  expected_resolution_date: sheetTicket.expected_resolution_date || sheetTicket.dueDate || "",
  escalation_level: sheetTicket.escalation_level || 0,
  updated_date: sheetTicket.updated_date || sheetTicket.updatedAt || "",
});

// Convert Ticket to CreateTicketData for SheetDB
const convertToCreateData = (ticket: Omit<Ticket, "grievance_id" | "created_date" | "updated_date" | "current_status">): CreateTicketData => ({
  farmer_id: ticket.farmer_id,
  pump_id: ticket.pump_id,
  category: ticket.category,
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

  const getTicketById = (ticketId: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.grievance_id === ticketId);
  };

  const sendEmailNotification = (ticket: Ticket) => {
    console.log(`Email notification sent for grievance ${ticket.grievance_id}`);
    console.log(`Category: ${ticket.category}`);
    console.log(`Assigned Vendor: ${ticket.assigned_vendor}`);
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
