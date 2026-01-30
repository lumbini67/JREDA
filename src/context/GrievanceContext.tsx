import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { districtOfficers } from "./AuthContext";
import { 
  getTickets as fetchTicketsFromSheetDB, 
  createTicket as createTicketInSheetDB,
  updateTicket as updateTicketInSheetDB,
  type CreateTicketData,
  type SheetDBTicket
} from "@/services/sheetdb";
import { dummyTicketsData, generateMoreDummyTickets } from "@/services/dummyTickets";

export type TicketStatus = "pending" | "in_progress" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  userEmail: string;
  district: string;
  site: string;
  dueDate: string;
  issueDescription: string;
  priority: Priority;
  fromDate?: string;
  contractor: string;
  images: string[];
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  deviceId?: string;
  deviceType?: string;
}

// Convert SheetDBTicket to Ticket
const convertToTicket = (sheetTicket: SheetDBTicket): Ticket => ({
  ...sheetTicket,
  status: sheetTicket.status as TicketStatus,
  priority: sheetTicket.priority as Priority,
  fromDate: undefined,
  images: sheetTicket.images ? sheetTicket.images.split(",").filter(Boolean) : [],
});

// Convert Ticket to CreateTicketData for SheetDB
const convertToCreateData = (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">): CreateTicketData => ({
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
  images: ticket.images,
  deviceId: ticket.deviceId,
  deviceType: ticket.deviceType,
});

interface GrievanceContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">) => Promise<Ticket>;
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
        
        // Populate with dummy data if empty, otherwise add 100 more tickets
        if (data.length === 0) {
          console.log("📝 No tickets found in SheetDB. Populating with 113 dummy tickets...");
          
          // Add initial dummy tickets
          await createMultipleTicketsToSheetDB(dummyTicketsData);
          
          // Generate and add 100 more tickets (total 113)
          const moreTickets = generateMoreDummyTickets(100);
          await createMultipleTicketsToSheetDB(moreTickets);
          
          // Fetch again after populating
          data = await fetchTicketsFromSheetDB();
        } else {
          // Add 100 more tickets to existing data
          console.log(`📝 Found ${data.length} tickets. Adding 100 more...`);
          const moreTickets = generateMoreDummyTickets(100);
          await createMultipleTicketsToSheetDB(moreTickets);
          
          // Fetch again after populating
          data = await fetchTicketsFromSheetDB();
        }
        
        const sortedTickets = data.map(convertToTicket).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
    }));

    const response = await fetch("https://sheetdb.io/api/v1/jv9mggt5mkged", {
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

  const addTicket = async (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "status">): Promise<Ticket> => {
    try {
      setError(null);
      const createData = convertToCreateData(ticketData);
      const newTicket = await createTicketInSheetDB(createData);
      const ticket = convertToTicket(newTicket);
      
      // Update local state
      setTickets((prev) => {
        const updated = [ticket, ...prev];
        return updated.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
      await updateTicketInSheetDB(ticketId, { status, updatedAt: new Date().toISOString() });
      
      // Update local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, status, updatedAt: new Date().toISOString() }
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
      const sheetUpdates: Partial<SheetDBTicket> = {
        ...updates,
        updatedAt: new Date().toISOString(),
        images: updates.images?.join(",") || "",
        status: updates.status,
        priority: updates.priority,
      };
      await updateTicketInSheetDB(ticketId, sheetUpdates);
      
      // Update local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
            : ticket
        )
      );
    } catch (err) {
      console.error("Failed to update ticket in SheetDB:", err);
      throw err;
    }
  };

  const getTicketsByUser = (userId: string): Ticket[] => {
    return tickets.filter((ticket) => ticket.userId === userId);
  };

  const getTicketById = (ticketId: string): Ticket | undefined => {
    return tickets.find((ticket) => ticket.id === ticketId);
  };

  const sendEmailNotification = (ticket: Ticket) => {
    const officer = districtOfficers.find((o) => o.district.toLowerCase() === ticket.district.toLowerCase());
    if (officer) {
      console.log(`Email notification sent to ${officer.name} (${officer.email}) for ticket ${ticket.id}`);
      console.log(`Subject: New Grievance Ticket - ${ticket.id}`);
      console.log(`Description: ${ticket.issueDescription}`);
    }
  };

  const refreshTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTicketsFromSheetDB();
      const sortedTickets = data.map(convertToTicket).sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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
