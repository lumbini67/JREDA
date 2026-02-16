import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Sun, Zap, Home, Thermometer, Lightbulb, Info, MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

// Custom icons for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const greenIcon = createCustomIcon("#22c55e");
const yellowIcon = createCustomIcon("#eab308");
const redIcon = createCustomIcon("#ef4444");

// Data for different management types with Jharkhand coordinates
// Jharkhand center: approximately 23.3434° N, 85.3096° E
const managementTypeData: Record<string, {
  title: string;
  icon: any;
  color: string;
  center: [number, number];
  locations: Array<{
    id: string;
    name: string;
    district: string;
    position: [number, number];
    status: "healthy" | "warning" | "critical";
    capacity: string;
    output: string;
    type: string;
    details: {
      owner?: string;
      installationDate?: string;
      panels?: string;
      batteryCapacity?: string;
      beneficiaries?: string;
      latitude: number;
      longitude: number;
    };
  }>;
}> = {
  solar_pumps: {
    title: "Solar Pumps",
    icon: Sun,
    color: "bg-primary",
    center: [23.3434, 85.3096],
    locations: [
      { id: "SP001", name: "Ranchi Solar Pump Station", district: "Ranchi", position: [23.3441, 85.3096], status: "healthy", capacity: "50 kW", output: "45 kW", type: "solar_pump", details: { owner: "Gram Panchayat", installationDate: "2021-03-15", panels: "150", beneficiaries: "120 households", latitude: 23.3441, longitude: 85.3096 } },
      { id: "SP002", name: "Hazaribagh Pump", district: "Hazaribagh", position: [23.9925, 85.3638], status: "healthy", capacity: "30 kW", output: "28 kW", type: "solar_pump", details: { owner: "JREDA", installationDate: "2022-06-20", panels: "90", beneficiaries: "80 households", latitude: 23.9925, longitude: 85.3638 } },
      { id: "SP003", name: "Dhanbad Solar Pump", district: "Dhanbad", position: [23.7954, 86.4302], status: "warning", capacity: "40 kW", output: "32 kW", type: "solar_pump", details: { owner: "Private", installationDate: "2020-11-10", panels: "120", beneficiaries: "100 households", latitude: 23.7954, longitude: 86.4302 } },
      { id: "SP004", name: "Jamshedpur Station", district: "Jamshedpur", position: [22.8049, 86.2025], status: "healthy", capacity: "25 kW", output: "23 kW", type: "solar_pump", details: { owner: "Municipal Corp", installationDate: "2023-01-05", panels: "75", beneficiaries: "60 households", latitude: 22.8049, longitude: 86.2025 } },
      { id: "SP005", name: "Deoghar Pump", district: "Deoghar", position: [24.4856, 86.6952], status: "critical", capacity: "35 kW", output: "20 kW", type: "solar_pump", details: { owner: "NGO", installationDate: "2019-08-22", panels: "105", beneficiaries: "90 households", latitude: 24.4856, longitude: 86.6952 } },
      { id: "SP006", name: "Bokaro Pump Station", district: "Bokaro", position: [23.6692, 86.1511], status: "healthy", capacity: "45 kW", output: "42 kW", type: "solar_pump", details: { owner: "SAIL", installationDate: "2021-07-10", panels: "135", beneficiaries: "110 households", latitude: 23.6692, longitude: 86.1511 } },
      { id: "SP007", name: "Giridih Solar Pump", district: "Giridih", position: [24.1901, 86.2978], status: "warning", capacity: "28 kW", output: "22 kW", type: "solar_pump", details: { owner: "District Admin", installationDate: "2020-05-15", panels: "84", beneficiaries: "70 households", latitude: 24.1901, longitude: 86.2978 } },
      { id: "SP008", name: "Dumka Pump", district: "Dumka", position: [24.2696, 87.2491], status: "healthy", capacity: "32 kW", output: "30 kW", type: "solar_pump", details: { owner: "JREDA", installationDate: "2022-01-20", panels: "96", beneficiaries: "85 households", latitude: 24.2696, longitude: 87.2491 } },
    ],
  },
  mini_grids: {
    title: "Mini Grids",
    icon: Zap,
    color: "bg-accent",
    center: [23.3434, 85.3096],
    locations: [
      { id: "MG001", name: "Betla Mini Grid", district: "Palamu", position: [23.8604, 84.1822], status: "healthy", capacity: "100 kW", output: "95 kW", type: "mini_grid", details: { owner: "NTPC", installationDate: "2022-04-10", panels: "300", batteryCapacity: "200 kWh", beneficiaries: "250 households", latitude: 23.8604, longitude: 84.1822 } },
      { id: "MG002", name: "Latehar Grid", district: "Latehar", position: [23.7406, 84.5175], status: "healthy", capacity: "75 kW", output: "70 kW", type: "mini_grid", details: { owner: "Tata Power", installationDate: "2022-09-15", panels: "225", batteryCapacity: "150 kWh", beneficiaries: "180 households", latitude: 23.7406, longitude: 84.5175 } },
      { id: "MG003", name: "Simdega Mini Grid", district: "Simdega", position: [22.6152, 84.9855], status: "warning", capacity: "50 kW", output: "42 kW", type: "mini_grid", details: { owner: "CESC", installationDate: "2021-12-01", panels: "150", batteryCapacity: "100 kWh", beneficiaries: "120 households", latitude: 22.6152, longitude: 84.9855 } },
      { id: "MG004", name: "Khunti Grid", district: "Khunti", position: [23.0746, 85.2789], status: "healthy", capacity: "60 kW", output: "58 kW", type: "mini_grid", details: { owner: "JREDA", installationDate: "2023-03-20", panels: "180", batteryCapacity: "120 kWh", beneficiaries: "140 households", latitude: 23.0746, longitude: 85.2789 } },
      { id: "MG005", name: "Saraikela Grid", district: "Saraikela Kharsawan", position: [22.7046, 85.9328], status: "healthy", capacity: "80 kW", output: "76 kW", type: "mini_grid", details: { owner: "Tata Steel", installationDate: "2022-08-10", panels: "240", batteryCapacity: "160 kWh", beneficiaries: "200 households", latitude: 22.7046, longitude: 85.9328 } },
      { id: "MG006", name: "Chaibasa Mini Grid", district: "West Singhbhum", position: [22.5506, 85.8106], status: "critical", capacity: "45 kW", output: "28 kW", type: "mini_grid", details: { owner: "Private", installationDate: "2020-11-25", panels: "135", batteryCapacity: "90 kWh", beneficiaries: "100 households", latitude: 22.5506, longitude: 85.8106 } },
    ],
  },
  rooftop_solar: {
    title: "Rooftop Solar",
    icon: Home,
    color: "bg-info",
    center: [23.3434, 85.3096],
    locations: [
      { id: "RS001", name: "Ranchi Collectorate", district: "Ranchi", position: [23.3441, 85.3096], status: "healthy", capacity: "200 kW", output: "190 kW", type: "rooftop_solar", details: { owner: "Government", installationDate: "2021-07-01", panels: "600", latitude: 23.3441, longitude: 85.3096 } },
      { id: "RS002", name: "Jamshedpur Tata Steel", district: "Jamshedpur", position: [22.8049, 86.2025], status: "healthy", capacity: "500 kW", output: "480 kW", type: "rooftop_solar", details: { owner: "Tata Steel", installationDate: "2020-05-15", panels: "1500", latitude: 22.8049, longitude: 86.2025 } },
      { id: "RS003", name: "Dhanbad College", district: "Dhanbad", position: [23.7954, 86.4302], status: "warning", capacity: "100 kW", output: "85 kW", type: "rooftop_solar", details: { owner: "Education Dept", installationDate: "2022-02-28", panels: "300", latitude: 23.7954, longitude: 86.4302 } },
      { id: "RS004", name: "Bokaro Steel Plant", district: "Bokaro", position: [23.6692, 86.1511], status: "healthy", capacity: "350 kW", output: "340 kW", type: "rooftop_solar", details: { owner: "SAIL", installationDate: "2021-11-10", panels: "1050", latitude: 23.6692, longitude: 86.1511 } },
      { id: "RS005", name: "Deoghar Temple Trust", district: "Deoghar", position: [24.4856, 86.6952], status: "healthy", capacity: "150 kW", output: "145 kW", type: "rooftop_solar", details: { owner: "Temple Trust", installationDate: "2023-01-20", panels: "450", latitude: 24.4856, longitude: 86.6952 } },
      { id: "RS006", name: "Hazaribagh Government Building", district: "Hazaribagh", position: [23.9925, 85.3638], status: "healthy", capacity: "120 kW", output: "115 kW", type: "rooftop_solar", details: { owner: "Government", installationDate: "2022-06-15", panels: "360", latitude: 23.9925, longitude: 85.3638 } },
      { id: "RS007", name: "Giridih Government College", district: "Giridih", position: [24.1901, 86.2978], status: "critical", capacity: "80 kW", output: "45 kW", type: "rooftop_solar", details: { owner: "Education Dept", installationDate: "2019-12-10", panels: "240", latitude: 24.1901, longitude: 86.2978 } },
      { id: "RS008", name: "Dumka Government Office", district: "Dumka", position: [24.2696, 87.2491], status: "warning", capacity: "90 kW", output: "72 kW", type: "rooftop_solar", details: { owner: "Government", installationDate: "2021-08-20", panels: "270", latitude: 24.2696, longitude: 87.2491 } },
    ],
  },
  solar_water_heater: {
    title: "Solar Water Heater",
    icon: Thermometer,
    color: "bg-orange-500",
    center: [23.3434, 85.3096],
    locations: [
      { id: "WH001", name: "Ranchi Hotel Residency", district: "Ranchi", position: [23.3441, 85.3096], status: "healthy", capacity: "10 kW", output: "8.2 kW", type: "solar_water_heater", details: { owner: "Hotel Residency Pvt Ltd", installationDate: "2023-08-15", panels: "30", temperature: "65°C", waterFlow: "25 L/min", latitude: 23.3441, longitude: 85.3096 } },
      { id: "WH002", name: "Jamshedpur TMH Hospital", district: "Jamshedpur", position: [22.8049, 86.2025], status: "healthy", capacity: "25 kW", output: "20.5 kW", type: "solar_water_heater", details: { owner: "Tata Memorial Hospital", installationDate: "2023-04-10", panels: "75", temperature: "72°C", waterFlow: "50 L/min", latitude: 22.8049, longitude: 86.2025 } },
      { id: "WH003", name: "Dhanbad Engineering College", district: "Dhanbad", position: [23.7954, 86.4302], status: "warning", capacity: "15 kW", output: "10.2 kW", type: "solar_water_heater", details: { owner: "Dhanbad Engineering College", installationDate: "2023-12-05", panels: "45", temperature: "58°C", waterFlow: "35 L/min", latitude: 23.7954, longitude: 86.4302 } },
      { id: "WH004", name: "Hazaribagh Green Valley Resort", district: "Hazaribagh", position: [23.9925, 85.3638], status: "healthy", capacity: "20 kW", output: "16.5 kW", type: "solar_water_heater", details: { owner: "Green Valley Resorts Ltd", installationDate: "2024-02-15", panels: "60", temperature: "68°C", waterFlow: "45 L/min", latitude: 23.9925, longitude: 85.3638 } },
      { id: "WH005", name: "Bokaro Steel City Guest House", district: "Bokaro", position: [23.6692, 86.1511], status: "critical", capacity: "8 kW", output: "0 kW", type: "solar_water_heater", details: { owner: "Bokaro Guest House Corp", installationDate: "2023-06-20", panels: "24", temperature: "45°C", waterFlow: "15 L/min", latitude: 23.6692, longitude: 86.1511 } },
      { id: "WH006", name: "Deoghar Luxury Hotel", district: "Deoghar", position: [24.4856, 86.6952], status: "healthy", capacity: "12 kW", output: "10.5 kW", type: "solar_water_heater", details: { owner: "Deoghar Hotels Ltd", installationDate: "2024-01-10", panels: "36", temperature: "62°C", waterFlow: "30 L/min", latitude: 24.4856, longitude: 86.6952 } },
    ],
  },
  solar_street_light: {
    title: "Solar Street Light",
    icon: Lightbulb,
    color: "bg-yellow-500",
    center: [23.3434, 85.3096],
    locations: [
      { id: "SL001", name: "Ranchi Main Market Road", district: "Ranchi", position: [23.3441, 85.3096], status: "healthy", capacity: "150 W", output: "120 W", type: "solar_street_light", details: { owner: "Ranchi Municipal Corp", installationDate: "2023-09-10", panels: "2", brightness: "2500 lux", operation: "12 hrs/day", latitude: 23.3441, longitude: 85.3096 } },
      { id: "SL002", name: "Jamshedpur NH-33 Highway", district: "Jamshedpur", position: [22.8049, 86.2025], status: "healthy", capacity: "200 W", output: "180 W", type: "solar_street_light", details: { owner: "NHAI Jharkhand", installationDate: "2023-05-20", panels: "3", brightness: "3500 lux", operation: "14 hrs/day", latitude: 22.8049, longitude: 86.2025 } },
      { id: "SL003", name: "Dhanbad Circular Road", district: "Dhanbad", position: [23.7954, 86.4302], status: "warning", capacity: "100 W", output: "70 W", type: "solar_street_light", details: { owner: "Dhanbad Municipal Corp", installationDate: "2023-11-15", panels: "1", brightness: "1800 lux", operation: "10 hrs/day", latitude: 23.7954, longitude: 86.4302 } },
      { id: "SL004", name: "Hazaribagh Station Road", district: "Hazaribagh", position: [23.9925, 85.3638], status: "healthy", capacity: "150 W", output: "130 W", type: "solar_street_light", details: { owner: "Hazaribagh Nagar Panchayat", installationDate: "2024-01-05", panels: "2", brightness: "2800 lux", operation: "12 hrs/day", latitude: 23.9925, longitude: 85.3638 } },
      { id: "SL005", name: "Bokaro Sector-4 Main Road", district: "Bokaro", position: [23.6692, 86.1511], status: "critical", capacity: "120 W", output: "0 W", type: "solar_street_light", details: { owner: "Bokaro Steel City Council", installationDate: "2023-07-25", panels: "2", brightness: "0 lux", operation: "0 hrs/day", latitude: 23.6692, longitude: 86.1511 } },
      { id: "SL006", name: "Deoghar Temple Road", district: "Deoghar", position: [24.4856, 86.6952], status: "healthy", capacity: "200 W", output: "170 W", type: "solar_street_light", details: { owner: "Deoghar Development Authority", installationDate: "2024-03-10", panels: "3", brightness: "3200 lux", operation: "14 hrs/day", latitude: 24.4856, longitude: 86.6952 } },
      { id: "SL007", name: "Giridih Main Chowk", district: "Giridih", position: [24.1901, 86.2978], status: "warning", capacity: "100 W", output: "65 W", type: "solar_street_light", details: { owner: "Giridih Nagar Panchayat", installationDate: "2023-08-20", panels: "1", brightness: "1600 lux", operation: "9 hrs/day", latitude: 24.1901, longitude: 86.2978 } },
      { id: "SL008", name: "Dumka Market Area", district: "Dumka", position: [24.2696, 87.2491], status: "healthy", capacity: "150 W", output: "125 W", type: "solar_street_light", details: { owner: "Dumka Municipal Council", installationDate: "2024-02-01", panels: "2", brightness: "2600 lux", operation: "12 hrs/day", latitude: 24.2696, longitude: 87.2491 } },
    ],
  },
  solar_high_mast: {
    title: "Solar High Mast",
    icon: Thermometer,
    color: "bg-purple-500",
    center: [23.3434, 85.3096],
    locations: [
      { id: "HM001", name: "Ranchi Albert Ekka Chowk", district: "Ranchi", position: [23.3441, 85.3096], status: "healthy", capacity: "2 kW", output: "1.65 kW", type: "solar_high_mast", details: { owner: "Ranchi Municipal Corp", installationDate: "2023-08-20", panels: "12", coverage: "500 sq.m", operation: "12 hrs/day", latitude: 23.3441, longitude: 85.3096 } },
      { id: "HM002", name: "Jamshedpur Jubilee Park", district: "Jamshedpur", position: [22.8049, 86.2025], status: "healthy", capacity: "3 kW", output: "2.55 kW", type: "solar_high_mast", details: { owner: "Jamshedpur Notified Area", installationDate: "2023-04-15", panels: "18", coverage: "800 sq.m", operation: "14 hrs/day", latitude: 22.8049, longitude: 86.2025 } },
      { id: "HM003", name: "Dhanbad Railway Station", district: "Dhanbad", position: [23.7954, 86.4302], status: "warning", capacity: "2.5 kW", output: "1.85 kW", type: "solar_high_mast", details: { owner: "East Central Railway", installationDate: "2023-10-30", panels: "15", coverage: "600 sq.m", operation: "10 hrs/day", latitude: 23.7954, longitude: 86.4302 } },
      { id: "HM004", name: "Bokaro Sector-1 Circle", district: "Bokaro", position: [23.6692, 86.1511], status: "critical", capacity: "1.5 kW", output: "0 kW", type: "solar_high_mast", details: { owner: "Bokaro Steel City Council", installationDate: "2023-06-10", panels: "9", coverage: "400 sq.m", operation: "0 hrs/day", latitude: 23.6692, longitude: 86.1511 } },
      { id: "HM005", name: "Hazaribagh Collectorate Ground", district: "Hazaribagh", position: [23.9925, 85.3638], status: "healthy", capacity: "2 kW", output: "1.72 kW", type: "solar_high_mast", details: { owner: "Hazaribagh District Admin", installationDate: "2024-02-01", panels: "12", coverage: "550 sq.m", operation: "12 hrs/day", latitude: 23.9925, longitude: 85.3638 } },
      { id: "HM006", name: "Deoghar Bus Terminal", district: "Deoghar", position: [24.4856, 86.6952], status: "healthy", capacity: "1.8 kW", output: "1.55 kW", type: "solar_high_mast", details: { owner: "Deoghar Road Transport", installationDate: "2024-01-15", panels: "11", coverage: "480 sq.m", operation: "13 hrs/day", latitude: 24.4856, longitude: 86.6952 } },
      { id: "HM007", name: "Giridih Main Square", district: "Giridih", position: [24.1901, 86.2978], status: "healthy", capacity: "1.2 kW", output: "1.05 kW", type: "solar_high_mast", details: { owner: "Giridih District Council", installationDate: "2023-12-15", panels: "8", coverage: "350 sq.m", operation: "11 hrs/day", latitude: 24.1901, longitude: 86.2978 } },
    ],
  },
};

const statusColors = {
  healthy: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive",
};

const statusLabels = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
};

const statusIcons = {
  healthy: greenIcon,
  warning: yellowIcon,
  critical: redIcon,
};

// Component to handle map centering
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 10);
  }, [center, map]);
  return null;
}

const ScadaMap = () => {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const typeData = managementTypeData[typeId || "solar_pumps"] || managementTypeData.solar_pumps;
  const Icon = typeData.icon;

  const filteredLocations = typeData.locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePinClick = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const handleViewDetails = (location: typeof typeData.locations[0]) => {
    navigate(`/scada-monitoring/${location.id}`, {
      state: {
        fromMap: true,
        locationData: location,
      },
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/scada-management")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              {typeData.title} Map - Jharkhand
            </h1>
            <p className="text-muted-foreground mt-1">
              Geographic visualization of {typeData.title.toLowerCase()} across Jharkhand state
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Jharkhand State Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <MapContainer
                  center={typeData.center}
                  zoom={9}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapUpdater center={typeData.center} />
                  {typeData.locations.map((location) => (
                    <Marker
                      key={location.id}
                      position={location.position}
                      icon={statusIcons[location.status]}
                      eventHandlers={{
                        click: () => handlePinClick(location.id),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-sm text-gray-600">{location.district}</p>
                          <div className="mt-2">
                            <Badge
                              className={
                                location.status === "healthy"
                                  ? "bg-green-500"
                                  : location.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }
                            >
                              {statusLabels[location.status]}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">Capacity: {location.capacity}</p>
                          <Button
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleViewDetails(location)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg z-[1000]">
                <h4 className="text-sm font-semibold mb-3">Status Legend</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
                    <span className="text-xs text-gray-600">Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow" />
                    <span className="text-xs text-gray-600">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow" />
                    <span className="text-xs text-gray-600">Critical</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Location Details */}
        <div className="space-y-6">
          {selectedLocation ? (
            (() => {
              const location = typeData.locations.find((l) => l.id === selectedLocation);
              if (!location) return null;
              return (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{location.name}</h3>
                      <p className="text-sm text-muted-foreground">{location.district}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[location.status]}>
                        {statusLabels[location.status]}
                      </Badge>
                      <Badge variant="outline">{location.type.replace("_", " ")}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Capacity</p>
                        <p className="font-semibold">{location.capacity}</p>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Current Output</p>
                        <p className="font-semibold">{location.output}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Coordinates</p>
                      <p className="text-sm font-mono">
                        {location.position[0].toFixed(4)}°N, {location.position[1].toFixed(4)}°E
                      </p>
                    </div>

                    {location.details.owner && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Owner</p>
                        <p className="text-sm font-medium">{location.details.owner}</p>
                      </div>
                    )}

                    {location.details.installationDate && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Installation Date</p>
                        <p className="text-sm font-medium">{location.details.installationDate}</p>
                      </div>
                    )}

                    {location.details.panels && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Solar Panels</p>
                        <p className="text-sm font-medium">{location.details.panels} panels</p>
                      </div>
                    )}

                    {location.details.batteryCapacity && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Battery Capacity</p>
                        <p className="text-sm font-medium">{location.details.batteryCapacity}</p>
                      </div>
                    )}

                    {location.details.beneficiaries && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Beneficiaries</p>
                        <p className="text-sm font-medium">{location.details.beneficiaries}</p>
                      </div>
                    )}

                    <Button className="w-full" onClick={() => handleViewDetails(location)}>
                      View Full Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })()
          ) : (
            <></>
             
          )}

          {/* Location List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">All Locations ({filteredLocations.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="max-h-[350px] overflow-y-auto space-y-2">
                {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedLocation === location.id
                      ? "bg-primary/10 border border-primary"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  onClick={() => handlePinClick(location.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{location.name}</p>
                      <p className="text-xs text-muted-foreground">{location.district}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusColors[location.status]}`} />
                  </div>
                </div>
              ))}
              </div>
              {filteredLocations.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No locations found matching "{searchTerm}"
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScadaMap;
