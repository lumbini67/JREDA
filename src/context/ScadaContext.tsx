import { createContext, useContext, useState, ReactNode } from "react";

export type ScadaType = "solar_pump" | "mini_grid" | "rooftop_solar";

export interface ScadaDevice {
  id: string;
  name: string;
  type: ScadaType;
  location: string;
  district: string;
  capacity: number; // kW
  status: "online" | "offline" | "maintenance";
  installationDate: string;
  beneficiaryName: string;
  beneficiaryContact: string;
  latitude: number;
  longitude: number;
  imei: string;
  // Live data (simulated)
  currentPower: number;
  todayEnergy: number;
  totalEnergy: number;
  lastSync: string;
}

interface ScadaContextType {
  devices: ScadaDevice[];
  addDevice: (device: Omit<ScadaDevice, "id" | "currentPower" | "todayEnergy" | "totalEnergy" | "lastSync">) => void;
  updateDevice: (id: string, device: Partial<ScadaDevice>) => void;
  deleteDevice: (id: string) => void;
  getDeviceById: (id: string) => ScadaDevice | undefined;
}

const ScadaContext = createContext<ScadaContextType | undefined>(undefined);

// Initial demo data
const initialDevices: ScadaDevice[] = [
  {
    id: "SCADA-001",
    name: "Ranchi Solar Pump Station 1",
    type: "solar_pump",
    location: "Angara Block, Ranchi",
    district: "Ranchi",
    capacity: 7.5,
    status: "online",
    installationDate: "2024-06-15",
    beneficiaryName: "Ramesh Kumar",
    beneficiaryContact: "9876543210",
    latitude: 23.3441,
    longitude: 85.3096,
    imei: "860906045525646",
    currentPower: 5.2,
    todayEnergy: 28.5,
    totalEnergy: 12450,
    lastSync: new Date().toISOString(),
  },
  {
    id: "SCADA-002",
    name: "Hazaribagh Mini Grid",
    type: "mini_grid",
    location: "Bishnugarh Block",
    district: "Hazaribagh",
    capacity: 50,
    status: "online",
    installationDate: "2024-03-20",
    beneficiaryName: "Gram Panchayat Bishnugarh",
    beneficiaryContact: "9876543211",
    latitude: 23.9925,
    longitude: 85.3637,
    imei: "860906045525647",
    currentPower: 38.5,
    todayEnergy: 185.2,
    totalEnergy: 45800,
    lastSync: new Date().toISOString(),
  },
  {
    id: "SCADA-003",
    name: "Dhanbad Rooftop Solar",
    type: "rooftop_solar",
    location: "Jharia Industrial Area",
    district: "Dhanbad",
    capacity: 25,
    status: "online",
    installationDate: "2024-01-10",
    beneficiaryName: "ABC Industries Pvt Ltd",
    beneficiaryContact: "9876543212",
    latitude: 23.7957,
    longitude: 86.4304,
    imei: "860906045525648",
    currentPower: 18.2,
    todayEnergy: 98.5,
    totalEnergy: 28900,
    lastSync: new Date().toISOString(),
  },
  {
    id: "SCADA-004",
    name: "Bokaro Solar Pump Station",
    type: "solar_pump",
    location: "Chas Block, Bokaro",
    district: "Bokaro",
    capacity: 5,
    status: "offline",
    installationDate: "2024-08-05",
    beneficiaryName: "Suresh Mahto",
    beneficiaryContact: "9876543213",
    latitude: 23.6693,
    longitude: 86.1511,
    imei: "860906045525649",
    currentPower: 0,
    todayEnergy: 12.3,
    totalEnergy: 8500,
    lastSync: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "SCADA-005",
    name: "Giridih Mini Grid Station",
    type: "mini_grid",
    location: "Deori Block",
    district: "Giridih",
    capacity: 75,
    status: "maintenance",
    installationDate: "2023-11-25",
    beneficiaryName: "Deori Gram Sabha",
    beneficiaryContact: "9876543214",
    latitude: 24.1854,
    longitude: 86.3003,
    imei: "860906045525650",
    currentPower: 0,
    todayEnergy: 45.8,
    totalEnergy: 68200,
    lastSync: new Date(Date.now() - 7200000).toISOString(),
  },
];

export function ScadaProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<ScadaDevice[]>(initialDevices);

  const addDevice = (device: Omit<ScadaDevice, "id" | "currentPower" | "todayEnergy" | "totalEnergy" | "lastSync">) => {
    const newDevice: ScadaDevice = {
      ...device,
      id: `SCADA-${String(devices.length + 1).padStart(3, "0")}`,
      currentPower: 0,
      todayEnergy: 0,
      totalEnergy: 0,
      lastSync: new Date().toISOString(),
    };
    setDevices((prev) => [...prev, newDevice]);
  };

  const updateDevice = (id: string, updatedData: Partial<ScadaDevice>) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, ...updatedData } : device
      )
    );
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
  };

  const getDeviceById = (id: string) => {
    return devices.find((device) => device.id === id);
  };

  return (
    <ScadaContext.Provider value={{ devices, addDevice, updateDevice, deleteDevice, getDeviceById }}>
      {children}
    </ScadaContext.Provider>
  );
}

export function useScada() {
  const context = useContext(ScadaContext);
  if (context === undefined) {
    throw new Error("useScada must be used within a ScadaProvider");
  }
  return context;
}
