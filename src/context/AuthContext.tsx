import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "admin";

export interface UserDevice {
  id: string;
  name: string;
  type: "solar_pump" | "mini_grid" | "rooftop_solar" | "high_mast";
  location: string;
  district: string;
  status: "online" | "offline";
  currentPower: number;
  todayEnergy: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  district: string;
  devices: UserDevice[];
}

// Dummy users for testing
const dummyUsers: { username: string; password: string; user: User }[] = [
  {
    username: "user1",
    password: "user123",
    user: {
      id: "u1",
      username: "user1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@gmail.com",
      role: "user",
      district: "Ranchi",
      devices: [
        { id: "d1", name: "Solar Pump - Kanke", type: "solar_pump", location: "Kanke Village", district: "Ranchi", status: "online", currentPower: 3.2, todayEnergy: 18.5 },
        { id: "d2", name: "Mini Grid - Ratu", type: "mini_grid", location: "Ratu Block", district: "Ranchi", status: "online", currentPower: 12.5, todayEnergy: 85.3 },
      ],
    },
  },
  {
    username: "user2",
    password: "user456",
    user: {
      id: "u2",
      username: "user2",
      name: "Priya Devi",
      email: "priya.devi@gmail.com",
      role: "user",
      district: "Dhanbad",
      devices: [
        { id: "d3", name: "Rooftop Solar - Jharia", type: "rooftop_solar", location: "Jharia Town", district: "Dhanbad", status: "online", currentPower: 5.1, todayEnergy: 32.8 },
        { id: "d4", name: "High Mast - Govindpur", type: "high_mast", location: "Govindpur", district: "Dhanbad", status: "offline", currentPower: 0, todayEnergy: 12.4 },
      ],
    },
  },
  {
    username: "user3",
    password: "user789",
    user: {
      id: "u3",
      username: "user3",
      name: "Amit Singh",
      email: "amit.singh@gmail.com",
      role: "user",
      district: "Bokaro",
      devices: [
        { id: "d5", name: "Solar Pump - Chas", type: "solar_pump", location: "Chas Block", district: "Bokaro", status: "online", currentPower: 2.8, todayEnergy: 15.2 },
        { id: "d6", name: "Mini Grid - Sector 4", type: "mini_grid", location: "Sector 4", district: "Bokaro", status: "online", currentPower: 18.2, todayEnergy: 112.5 },
        { id: "d7", name: "High Mast - City Center", type: "high_mast", location: "City Center", district: "Bokaro", status: "online", currentPower: 0.8, todayEnergy: 5.2 },
      ],
    },
  },
  {
    username: "admin",
    password: "admin123",
    user: {
      id: "a1",
      username: "admin",
      name: "Administrator",
      email: "admin@jreda.gov.in",
      role: "admin",
      district: "All",
      devices: [],
    },
  },
];

// District officers for email notifications
export const districtOfficers: { district: string; name: string; email: string }[] = [
  { district: "Ranchi", name: "Mr. Sunil Kumar", email: "ranchi.officer@jreda.gov.in" },
  { district: "Dhanbad", name: "Mrs. Rekha Singh", email: "dhanbad.officer@jreda.gov.in" },
  { district: "Bokaro", name: "Mr. Anil Sharma", email: "bokaro.officer@jreda.gov.in" },
  { district: "Jamshedpur", name: "Mr. Rahul Verma", email: "jamshedpur.officer@jreda.gov.in" },
  { district: "Hazaribagh", name: "Mrs. Meena Devi", email: "hazaribagh.officer@jreda.gov.in" },
  { district: "Giridih", name: "Mr. Pankaj Kumar", email: "giridih.officer@jreda.gov.in" },
  { district: "Deoghar", name: "Mr. Vijay Singh", email: "deoghar.officer@jreda.gov.in" },
  { district: "Dumka", name: "Mrs. Sushma Kumari", email: "dumka.officer@jreda.gov.in" },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("jreda-user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("jreda-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jreda-user");
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    const found = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
