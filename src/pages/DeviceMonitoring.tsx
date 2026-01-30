import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cpu,
  Activity,
  Thermometer,
  Zap,
  Droplets,
  Sun,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  Settings,
  RefreshCw,
  ChevronRight,
  Battery,
  Gauge,
  Radio,
} from "lucide-react";

// SCADA Parameter data structure based on SOW Annexure
const scadaDevice = {
  imei: "860906045525646",
  asn: "JREDA-SPP-001",
  lastSync: new Date().toISOString(),
  connectionStatus: "online",
  signalStrength: 85,
  firmware: "v2.3.1",
  protocol: "MQTT/TLS",
};

const pumpControllerData = {
  PST1: 1, // Status: 1 = Running
  PREFFREQ1: 50.0, // Reference Frequency Hz
  POPFREQ1: 49.8, // Output Frequency Hz
  POPI1: 18.5, // Output Current A
  POPV1: 228.0, // Output Voltage V
  POPKW1: 4.2, // Output Power kW
  PDC1V1: 545.0, // DC Input Voltage V
  PDC11: 8.2, // DC Current A
  PDCVOC1: 650.0, // DC Open Circuit Voltage V
  PDKWH1: 28.5, // Today Generated Energy kWh
  PTOTKWH1: 12450.0, // Cumulative Energy kWh
  POPFLW1: 185, // Flow Speed LPM
  POPDWD1: 22400, // Daily Water Discharge L
  POPTOTWD1: 4850000, // Total Water Discharge L
  PDHR1: 6.5, // Pump Day Run Hours
  PTOTHR1: 2840.0, // Cumulative Run Hours
};

const inverterData = {
  IST1: 1, // Status: Running
  IFREQ1: 50.0, // Frequency
  IPF1: 0.95, // Power Factor
  IDC1V1: 540.0, // DC-1 Voltage
  IDC1I1: 4.2, // DC-1 Current
  IDC1KW1: 2.3, // DC-1 Power
  IDC2V1: 538.0, // DC-2 Voltage
  IDC2I1: 4.1, // DC-2 Current
  IDC2KW1: 2.2, // DC-2 Power
  IKW1: 4.5, // Total Active Power
  ITKWH1: 28.5, // Today Generated Energy
  ILKWH1: 12450.0, // Lifetime Energy
  ITEMP1: 42.0, // Temperature °C
};

const meterData = {
  VRN1: 238.5, // R Phase to Neutral Voltage
  VYN1: 240.2, // Y Phase to Neutral Voltage
  VBN1: 239.8, // B Phase to Neutral Voltage
  IR1: 7.2, // R Phase Current
  IY1: 7.1, // Y Phase Current
  IB1: 7.3, // B Phase Current
  PF1: 0.95, // Average Power Factor
  FRQ1: 50.02, // Grid Frequency
  POW1: 5.1, // Total Active Power kW
  KWHIMP1: 1250.0, // Import Energy kWh
  KWHEXP1: 11200.0, // Export Energy kWh
  POFF1: 45, // Power Failure Duration min
};

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: "Stopped", color: "bg-muted text-muted-foreground" },
  1: { label: "Running", color: "bg-success/10 text-success" },
  2: { label: "Sleep Mode", color: "bg-info/10 text-info" },
  3: { label: "Low Speed Protection", color: "bg-warning/10 text-warning" },
  4: { label: "Dry Run Protection", color: "bg-destructive/10 text-destructive" },
  5: { label: "Over Current Protection", color: "bg-destructive/10 text-destructive" },
  6: { label: "Min Power Protection", color: "bg-warning/10 text-warning" },
};

const DeviceMonitoring = () => {
  const [liveData, setLiveData] = useState({
    pump: pumpControllerData,
    inverter: inverterData,
    meter: meterData,
  });
  const [refreshing, setRefreshing] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        pump: {
          ...prev.pump,
          POPKW1: prev.pump.POPKW1 + (Math.random() - 0.5) * 0.2,
          POPI1: prev.pump.POPI1 + (Math.random() - 0.5) * 0.5,
          POPFLW1: Math.round(prev.pump.POPFLW1 + (Math.random() - 0.5) * 5),
          PDKWH1: prev.pump.PDKWH1 + 0.01,
        },
        inverter: {
          ...prev.inverter,
          ITEMP1: prev.inverter.ITEMP1 + (Math.random() - 0.5) * 0.5,
          IKW1: prev.inverter.IKW1 + (Math.random() - 0.5) * 0.1,
        },
        meter: {
          ...prev.meter,
          POW1: prev.meter.POW1 + (Math.random() - 0.5) * 0.1,
          FRQ1: 50 + (Math.random() - 0.5) * 0.1,
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const pumpStatus = statusMap[liveData.pump.PST1] || statusMap[0];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              SCADA Device Monitoring
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time IoT data from Remote Monitoring Systems (RMS)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="JREDA-SPP-001">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JREDA-SPP-001">JREDA-SPP-001</SelectItem>
                <SelectItem value="JREDA-SPP-002">JREDA-SPP-002</SelectItem>
                <SelectItem value="JREDA-SPP-003">JREDA-SPP-003</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className={refreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Device Info Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Device IMEI</p>
                  <p className="font-mono text-sm">{scadaDevice.imei}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-info" />
                <div>
                  <p className="text-xs text-muted-foreground">Protocol</p>
                  <p className="text-sm font-medium">{scadaDevice.protocol}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {scadaDevice.connectionStatus === "online" ? (
                  <Wifi className="w-5 h-5 text-success" />
                ) : (
                  <WifiOff className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Signal</p>
                  <div className="flex items-center gap-1">
                    <Progress value={scadaDevice.signalStrength} className="w-16 h-2" />
                    <span className="text-xs">{scadaDevice.signalStrength}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={pumpStatus.color}>{pumpStatus.label}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Last sync: {new Date(scadaDevice.lastSync).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.pump.POPKW1.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Output Power (kW)</p>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 text-center">
            <Sun className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.pump.PDC1V1.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">DC Voltage (V)</p>
          </CardContent>
        </Card>
        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 text-center">
            <Droplets className="w-6 h-6 text-info mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.pump.POPFLW1}</p>
            <p className="text-xs text-muted-foreground">Flow Rate (LPM)</p>
          </CardContent>
        </Card>
        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <Battery className="w-6 h-6 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.pump.PDKWH1.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Today Energy (kWh)</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/5 border-warning/20">
          <CardContent className="p-4 text-center">
            <Thermometer className="w-6 h-6 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.inverter.ITEMP1.toFixed(1)}°</p>
            <p className="text-xs text-muted-foreground">Inverter Temp</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Gauge className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-2xl font-bold">{liveData.pump.PDHR1.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Run Hours Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Parameters Tabs */}
      <Tabs defaultValue="pump" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="pump">Pump Controller</TabsTrigger>
          <TabsTrigger value="inverter">Inverter</TabsTrigger>
          <TabsTrigger value="meter">Energy Meter</TabsTrigger>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
        </TabsList>

        <TabsContent value="pump" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Output Parameters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Output Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Output Voltage</span>
                  <span className="font-mono">{liveData.pump.POPV1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Output Current</span>
                  <span className="font-mono">{liveData.pump.POPI1.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Output Frequency</span>
                  <span className="font-mono">{liveData.pump.POPFREQ1.toFixed(1)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Power</span>
                  <span className="font-mono">{liveData.pump.POPKW1.toFixed(2)} kW</span>
                </div>
              </CardContent>
            </Card>

            {/* DC Input Parameters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent" />
                  Solar DC Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DC Voltage</span>
                  <span className="font-mono">{liveData.pump.PDC1V1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">DC Current</span>
                  <span className="font-mono">{liveData.pump.PDC11.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Open Circuit Voltage</span>
                  <span className="font-mono">{liveData.pump.PDCVOC1.toFixed(1)} V</span>
                </div>
              </CardContent>
            </Card>

            {/* Water Discharge */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-info" />
                  Water Discharge
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Flow Rate</span>
                  <span className="font-mono">{liveData.pump.POPFLW1} LPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Daily Discharge</span>
                  <span className="font-mono">{(liveData.pump.POPDWD1 / 1000).toFixed(1)} KL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Discharge</span>
                  <span className="font-mono">{(liveData.pump.POPTOTWD1 / 1000000).toFixed(2)} ML</span>
                </div>
              </CardContent>
            </Card>

            {/* Energy Generation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-success" />
                  Energy Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Generation</span>
                  <span className="font-mono">{liveData.pump.PDKWH1.toFixed(2)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cumulative Energy</span>
                  <span className="font-mono">{(liveData.pump.PTOTKWH1 / 1000).toFixed(2)} MWh</span>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Today's Run Hours</span>
                  <span className="font-mono">{liveData.pump.PDHR1.toFixed(1)} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Run Hours</span>
                  <span className="font-mono">{liveData.pump.PTOTHR1.toFixed(0)} hrs</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inverter" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">DC String 1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Voltage</span>
                  <span className="font-mono">{liveData.inverter.IDC1V1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-mono">{liveData.inverter.IDC1I1.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Power</span>
                  <span className="font-mono">{liveData.inverter.IDC1KW1.toFixed(2)} kW</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">DC String 2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Voltage</span>
                  <span className="font-mono">{liveData.inverter.IDC2V1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-mono">{liveData.inverter.IDC2I1.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Power</span>
                  <span className="font-mono">{liveData.inverter.IDC2KW1.toFixed(2)} kW</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Inverter Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Power</span>
                  <span className="font-mono">{liveData.inverter.IKW1.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Power Factor</span>
                  <span className="font-mono">{liveData.inverter.IPF1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Temperature</span>
                  <span className={`font-mono ${liveData.inverter.ITEMP1 > 50 ? 'text-destructive' : ''}`}>
                    {liveData.inverter.ITEMP1.toFixed(1)} °C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lifetime Energy</span>
                  <span className="font-mono">{(liveData.inverter.ILKWH1 / 1000).toFixed(2)} MWh</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meter" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Phase Voltages (L-N)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">R Phase</span>
                  <span className="font-mono">{liveData.meter.VRN1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Y Phase</span>
                  <span className="font-mono">{liveData.meter.VYN1.toFixed(1)} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">B Phase</span>
                  <span className="font-mono">{liveData.meter.VBN1.toFixed(1)} V</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Phase Currents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">R Phase</span>
                  <span className="font-mono">{liveData.meter.IR1.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Y Phase</span>
                  <span className="font-mono">{liveData.meter.IY1.toFixed(2)} A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">B Phase</span>
                  <span className="font-mono">{liveData.meter.IB1.toFixed(2)} A</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Power & Energy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Power</span>
                  <span className="font-mono">{liveData.meter.POW1.toFixed(2)} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Power Factor</span>
                  <span className="font-mono">{liveData.meter.PF1.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Frequency</span>
                  <span className="font-mono">{liveData.meter.FRQ1.toFixed(2)} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Import Energy</span>
                  <span className="font-mono">{liveData.meter.KWHIMP1.toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Export Energy</span>
                  <span className="font-mono text-success">{liveData.meter.KWHEXP1.toFixed(1)} kWh</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alarms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Active Alarms & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Inverter Temperature High</p>
                    <p className="text-sm text-muted-foreground">Temperature exceeds 40°C warning threshold</p>
                    <p className="text-xs text-muted-foreground mt-1">Triggered: 2 hours ago</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-info/5 border border-info/20 flex items-start gap-3">
                  <Activity className="w-5 h-5 text-info shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Low Generation Alert</p>
                    <p className="text-sm text-muted-foreground">Current CUF below weekly average by 15%</p>
                    <p className="text-xs text-muted-foreground mt-1">Triggered: 1 day ago</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">No critical alarms active</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">System Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DeviceMonitoring;
