import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLanguage } from "@/context/LanguageContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { RecentGrievances } from "@/components/dashboard/RecentGrievances";
import { PumpStatusMap } from "@/components/dashboard/PumpStatusMap";
import { LiveMetrics } from "@/components/dashboard/LiveMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
// import { Sun, Zap, Users, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Activity,
  AlertCircle,
  Battery,
  Bell,
  Calendar,
  CheckCircle,
  CloudSun,
  Download,
  Droplets,
  Home,
  MapPin,
  PanelTop,
  RefreshCw,
  Sun,
  ThermometerSun,
  TrendingUp,
  Users,
  Zap,
  Target,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useState, useEffect } from "react";

const Index = () => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState('today');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('summary');

  // Format date based on time range
  const formattedDate = () => {
    const now = lastUpdated;
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return now.toLocaleDateString('en-US', options);
  };

  // Refresh data and update timestamp
  const handleRefresh = () => {
    setShowRefreshDialog(true);
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 10000);
  };

  // Generate mock data based on time range
  const getGenerationData = () => {
    const multiplier = timeRange === 'today' ? 1 : 
                       timeRange === 'week' ? 1.2 : 
                       timeRange === 'month' ? 1.5 : 
                       timeRange === 'quarter' ? 1.8 : 2.2;
    
    if (timeRange === 'today') {
      return [
        { time: '06:00', solarPumps: Math.round(120 * multiplier), rooftopSolar: Math.round(80 * multiplier), miniGrids: Math.round(45 * multiplier), canalTop: Math.round(200 * multiplier) },
        { time: '08:00', solarPumps: Math.round(180 * multiplier), rooftopSolar: Math.round(150 * multiplier), miniGrids: Math.round(60 * multiplier), canalTop: Math.round(320 * multiplier) },
        { time: '10:00', solarPumps: Math.round(220 * multiplier), rooftopSolar: Math.round(210 * multiplier), miniGrids: Math.round(75 * multiplier), canalTop: Math.round(450 * multiplier) },
        { time: '12:00', solarPumps: Math.round(250 * multiplier), rooftopSolar: Math.round(240 * multiplier), miniGrids: Math.round(85 * multiplier), canalTop: Math.round(580 * multiplier) },
        { time: '14:00', solarPumps: Math.round(230 * multiplier), rooftopSolar: Math.round(220 * multiplier), miniGrids: Math.round(80 * multiplier), canalTop: Math.round(520 * multiplier) },
        { time: '16:00', solarPumps: Math.round(180 * multiplier), rooftopSolar: Math.round(190 * multiplier), miniGrids: Math.round(70 * multiplier), canalTop: Math.round(420 * multiplier) },
        { time: '18:00', solarPumps: Math.round(90 * multiplier), rooftopSolar: Math.round(110 * multiplier), miniGrids: Math.round(50 * multiplier), canalTop: Math.round(280 * multiplier) },
      ];
    } else if (timeRange === 'week') {
      return [
        { time: 'Mon', solarPumps: Math.round(2200 * multiplier), rooftopSolar: Math.round(1800 * multiplier), miniGrids: Math.round(650 * multiplier), canalTop: Math.round(3500 * multiplier) },
        { time: 'Tue', solarPumps: Math.round(2100 * multiplier), rooftopSolar: Math.round(1750 * multiplier), miniGrids: Math.round(620 * multiplier), canalTop: Math.round(3400 * multiplier) },
        { time: 'Wed', solarPumps: Math.round(2300 * multiplier), rooftopSolar: Math.round(1850 * multiplier), miniGrids: Math.round(680 * multiplier), canalTop: Math.round(3600 * multiplier) },
        { time: 'Thu', solarPumps: Math.round(2150 * multiplier), rooftopSolar: Math.round(1700 * multiplier), miniGrids: Math.round(640 * multiplier), canalTop: Math.round(3300 * multiplier) },
        { time: 'Fri', solarPumps: Math.round(2250 * multiplier), rooftopSolar: Math.round(1900 * multiplier), miniGrids: Math.round(670 * multiplier), canalTop: Math.round(3550 * multiplier) },
        { time: 'Sat', solarPumps: Math.round(1800 * multiplier), rooftopSolar: Math.round(1500 * multiplier), miniGrids: Math.round(500 * multiplier), canalTop: Math.round(2800 * multiplier) },
        { time: 'Sun', solarPumps: Math.round(1600 * multiplier), rooftopSolar: Math.round(1300 * multiplier), miniGrids: Math.round(450 * multiplier), canalTop: Math.round(2500 * multiplier) },
      ];
    } else if (timeRange === 'month') {
      return [
        { time: 'Week 1', solarPumps: Math.round(15000 * multiplier), rooftopSolar: Math.round(12000 * multiplier), miniGrids: Math.round(4500 * multiplier), canalTop: Math.round(24000 * multiplier) },
        { time: 'Week 2', solarPumps: Math.round(15500 * multiplier), rooftopSolar: Math.round(12500 * multiplier), miniGrids: Math.round(4700 * multiplier), canalTop: Math.round(25000 * multiplier) },
        { time: 'Week 3', solarPumps: Math.round(14800 * multiplier), rooftopSolar: Math.round(11800 * multiplier), miniGrids: Math.round(4400 * multiplier), canalTop: Math.round(23800 * multiplier) },
        { time: 'Week 4', solarPumps: Math.round(16000 * multiplier), rooftopSolar: Math.round(13000 * multiplier), miniGrids: Math.round(4800 * multiplier), canalTop: Math.round(26000 * multiplier) },
      ];
    } else if (timeRange === 'quarter') {
      return [
        { time: 'Jan', solarPumps: Math.round(55000 * multiplier), rooftopSolar: Math.round(45000 * multiplier), miniGrids: Math.round(18000 * multiplier), canalTop: Math.round(90000 * multiplier) },
        { time: 'Feb', solarPumps: Math.round(52000 * multiplier), rooftopSolar: Math.round(42000 * multiplier), miniGrids: Math.round(17000 * multiplier), canalTop: Math.round(85000 * multiplier) },
        { time: 'Mar', solarPumps: Math.round(58000 * multiplier), rooftopSolar: Math.round(48000 * multiplier), miniGrids: Math.round(19000 * multiplier), canalTop: Math.round(95000 * multiplier) },
      ];
    } else {
      return [
        { time: 'Q1', solarPumps: Math.round(165000 * multiplier), rooftopSolar: Math.round(135000 * multiplier), miniGrids: Math.round(54000 * multiplier), canalTop: Math.round(270000 * multiplier) },
        { time: 'Q2', solarPumps: Math.round(175000 * multiplier), rooftopSolar: Math.round(145000 * multiplier), miniGrids: Math.round(58000 * multiplier), canalTop: Math.round(290000 * multiplier) },
        { time: 'Q3', solarPumps: Math.round(185000 * multiplier), rooftopSolar: Math.round(155000 * multiplier), miniGrids: Math.round(62000 * multiplier), canalTop: Math.round(310000 * multiplier) },
        { time: 'Q4', solarPumps: Math.round(170000 * multiplier), rooftopSolar: Math.round(140000 * multiplier), miniGrids: Math.round(56000 * multiplier), canalTop: Math.round(280000 * multiplier) },
      ];
    }
  };

  const generationData = getGenerationData();

  // Get metrics based on time range
  const getMetrics = () => {
    const base = {
      today: { capacity: '2,850 MW', projects: 632, pumps: '2,350' },
      week: { capacity: '2,920 MW', projects: 638, pumps: '2,380' },
      month: { capacity: '3,050 MW', projects: 655, pumps: '2,450' },
      quarter: { capacity: '3,200 MW', projects: 680, pumps: '2,550' },
      year: { capacity: '4,000 MW', projects: 750, pumps: '3,000' }
    };
    return base[timeRange as keyof typeof base];
  };

  const metrics = getMetrics();

  // Get rooftop solar data based on time range
  const getRooftopData = () => {
    const multipliers = {
      today: { installations: 1, capacity: 1, savings: 1 },
      week: { installations: 7, capacity: 7.5, savings: 8 },
      month: { installations: 28, capacity: 30, savings: 35 },
      quarter: { installations: 85, capacity: 90, savings: 100 },
      year: { installations: 320, capacity: 350, savings: 400 }
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return {
      installations: Math.round(1200 * m.installations / 30),
      capacity: (18.5 * m.capacity / 30).toFixed(1),
      savings: Math.round(32 * m.savings / 30)
    };
  };

  // Get mini grids data based on time range
  const getMiniGridsData = () => {
    const multipliers = {
      today: { villages: 1, households: 1, battery: 92 },
      week: { villages: 5, households: 28, battery: 92 },
      month: { villages: 18, households: 120, battery: 91 },
      quarter: { villages: 50, households: 350, battery: 90 },
      year: { villages: 185, households: 1400, battery: 88 }
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return {
      villages: Math.round(185 * m.villages / 365),
      households: Math.round(4520 * m.households / 365),
      battery: m.battery
    };
  };

  // Get canal top solar data based on time range
  const getCanalTopData = () => {
    const multipliers = {
      today: { capacity: 150, feedIn: 720 },
      week: { capacity: 152, feedIn: 5040 },
      month: { capacity: 158, feedIn: 21600 },
      quarter: { capacity: 165, feedIn: 64800 },
      year: { capacity: 180, feedIn: 260000 }
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return {
      capacity: Math.round(150 * m.capacity / 150),
      feedIn: Math.round(720 * m.feedIn / 720)
    };
  };

  // Get PM JANMAN data based on time range
  const getJanmanData = () => {
    const multipliers = {
      today: { projects: 1, beneficiaries: 300 },
      week: { projects: 5, beneficiaries: 1800 },
      month: { projects: 18, beneficiaries: 7200 },
      quarter: { projects: 50, beneficiaries: 20000 },
      year: { projects: 95, beneficiaries: 80000 }
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return {
      projects: Math.round(95 * m.projects / 365),
      beneficiaries: Math.round(28700 * m.beneficiaries / 365)
    };
  };

  // Get grievance data based on time range
  const getGrievanceData = () => {
    const multipliers = {
      today: { newToday: 18, pending: 45, avgHours: 3.5 },
      week: { newToday: 85, pending: 120, avgHours: 4.2 },
      month: { newToday: 320, pending: 280, avgHours: 5.1 },
      quarter: { newToday: 850, pending: 450, avgHours: 6.0 },
      year: { newToday: 2800, pending: 800, avgHours: 7.5 }
    };
    return multipliers[timeRange as keyof typeof multipliers];
  };

  // Get complaint types data based on time range
  const getComplaintTypes = () => {
    const multipliers = {
      today: [
        { name: 'Technical Issues', count: 8, color: '#ef4444' },
        { name: 'Billing Queries', count: 5, color: '#f59e0b' },
        { name: 'Installation', count: 3, color: '#10b981' },
        { name: 'Maintenance', count: 2, color: '#3b82f6' },
      ],
      week: [
        { name: 'Technical Issues', count: 35, color: '#ef4444' },
        { name: 'Billing Queries', count: 22, color: '#f59e0b' },
        { name: 'Installation', count: 15, color: '#10b981' },
        { name: 'Maintenance', count: 13, color: '#3b82f6' },
      ],
      month: [
        { name: 'Technical Issues', count: 120, color: '#ef4444' },
        { name: 'Billing Queries', count: 85, color: '#f59e0b' },
        { name: 'Installation', count: 55, color: '#10b981' },
        { name: 'Maintenance', count: 60, color: '#3b82f6' },
      ],
      quarter: [
        { name: 'Technical Issues', count: 320, color: '#ef4444' },
        { name: 'Billing Queries', count: 220, color: '#f59e0b' },
        { name: 'Installation', count: 150, color: '#10b981' },
        { name: 'Maintenance', count: 160, color: '#3b82f6' },
      ],
      year: [
        { name: 'Technical Issues', count: 1100, color: '#ef4444' },
        { name: 'Billing Queries', count: 750, color: '#f59e0b' },
        { name: 'Installation', count: 520, color: '#10b981' },
        { name: 'Maintenance', count: 550, color: '#3b82f6' },
      ]
    };
    return multipliers[timeRange as keyof typeof multipliers];
  };

  // Get district data based on time range
  const getDistrictData = () => {
    const multipliers = {
      today: 1,
      week: 7,
      month: 30,
      quarter: 90,
      year: 365
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return [
      { name: 'Ranchi', value: Math.round(420 * m), color: '#3b82f6' },
      { name: 'Hazaribagh', value: Math.round(380 * m), color: '#10b981' },
      { name: 'Dhanbad', value: Math.round(350 * m), color: '#8b5cf6' },
      { name: 'Jamshedpur', value: Math.round(320 * m), color: '#f59e0b' },
      { name: 'Bokaro', value: Math.round(280 * m), color: '#ef4444' },
      { name: 'Deoghar', value: Math.round(240 * m), color: '#ec4899' },
    ];
  };

  // Get Giridhi Solar City data based on time range
  const getGiridhiData = () => {
    const multipliers = {
      today: { capacity: 25, components: 14 },
      week: { capacity: 25, components: 15 },
      month: { capacity: 25.5, components: 16 },
      quarter: { capacity: 26, components: 17 },
      year: { capacity: 28, components: 18 }
    };
    return multipliers[timeRange as keyof typeof multipliers];
  };

  // Get energy mix data based on time range
  const getEnergyMixData = () => {
    return [
      { name: 'Solar Pumps', value: 35, color: '#3b82f6' },
      { name: 'Rooftop Solar', value: 25, color: '#f59e0b' },
      { name: 'Canal-Top', value: 20, color: '#8b5cf6' },
      { name: 'Mini Grids', value: 15, color: '#10b981' },
      { name: 'Other RE', value: 5, color: '#ec4899' },
    ];
  };

  // Get project status data based on time range
  const getProjectStatusData = () => {
    const multipliers = {
      today: { completed: 45, inProgress: 35, planned: 15, delayed: 5 },
      week: { completed: 48, inProgress: 33, planned: 14, delayed: 5 },
      month: { completed: 52, inProgress: 30, planned: 13, delayed: 5 },
      quarter: { completed: 55, inProgress: 28, planned: 12, delayed: 5 },
      year: { completed: 60, inProgress: 25, planned: 10, delayed: 5 }
    };
    const m = multipliers[timeRange as keyof typeof multipliers];
    return [
      { name: 'Completed', value: m.completed, color: '#10b981' },
      { name: 'In Progress', value: m.inProgress, color: '#3b82f6' },
      { name: 'Planned', value: m.planned, color: '#f59e0b' },
      { name: 'Delayed', value: m.delayed, color: '#ef4444' },
    ];
  };

  // Get achievement percentage based on time range
  const getAchievementPercentage = () => {
    const percentages = {
      today: 71.3,
      week: 73.0,
      month: 76.3,
      quarter: 80.0,
      year: 100.0
    };
    return percentages[timeRange as keyof typeof percentages];
  };

  const rooftopData = getRooftopData();
  const miniGridsData = getMiniGridsData();
  const canalTopData = getCanalTopData();
  const janmanData = getJanmanData();
  const grievanceData = getGrievanceData();
  const complaintTypes = getComplaintTypes();
  const districtData = getDistrictData();
  const giridhiData = getGiridhiData();
  const energyMixData = getEnergyMixData();
  const projectStatusData = getProjectStatusData();
  const achievementPercentage = getAchievementPercentage();

  // Download function
  const handleDownload = (format: string) => {
    const reportData = {
      reportType: selectedReportType,
      format: format,
      date: new Date().toISOString(),
      data: {
        generationData,
        districtData,
        complaintTypes,
        energyMixData,
        projectStatusData,
        metrics
      }
    };

    if (format === 'pdf') {
      // Create a simple text-based PDF-like content
      const content = `
JREDA Renewable Energy Dashboard Report
========================================
Report Type: ${selectedReportType}
Format: PDF
Generated: ${formattedDate()}
Time Range: ${timeRange}

Metrics Summary:
---------------
Total RE Capacity: ${metrics.capacity}
Active Projects: ${metrics.projects}
PM-KUSUM Pumps: ${metrics.pumps}

Generation Data:
----------------
${generationData.map(d => `${d.time}: Solar ${d.solarPumps}, Rooftop ${d.rooftopSolar}, Mini Grids ${d.miniGrids}`).join('\n')}

This is a simulated PDF download.
      `;
      downloadFile(content, `jreda-report-${timeRange}.txt`, 'text/plain');
    } else if (format === 'excel') {
      const csv = convertToCSV(generationData);
      downloadFile(csv, `jreda-report-${timeRange}.csv`, 'text/csv');
    } else {
      const json = JSON.stringify(reportData, null, 2);
      downloadFile(json, `jreda-report-${timeRange}.json`, 'application/json');
    }
    setShowDownloadDialog(false);
  };

  // Convert data to CSV
  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  // Download file helper
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }; 

  return (  
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-3 md:p-4 lg:p-6">
      {/* Header */}
      <header className="mb-6 lg:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
                <span className="whitespace-nowrap">JREDA Renewable Energy</span>
              </h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                System Healthy
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {formattedDate()}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Unified Monitoring Dashboard</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowExportDialog(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 md:flex-none min-w-[140px]"
            >
              <TrendingUp size={18} />
              Export Report
            </button>
            <button 
              onClick={() => {
                setShowRefreshDialog(true);
                setIsRefreshing(true);
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 2000);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 md:flex-none"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button 
              onClick={() => setShowAlertsDialog(true)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base flex-1 md:flex-none"
            >
              <Bell size={18} />
              Alerts
            </button>
          </div>
        </div>
      </header>

      {/* Time Range Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Grid - Proper Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Left Column - Executive Summary & Key Metrics */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Executive Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Total RE Capacity */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">Total RE Capacity</span>
                <Target className="text-blue-500" size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600">4,000 MW</div>
              <div className="mt-2 text-sm text-gray-500">Target: 4,000 MW</div>
            </div>

            {/* Current Installed */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">Current Installed</span>
                <Zap className="text-green-500" size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-green-600">{metrics.capacity}</div>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Achievement</span>
                  <span className="font-semibold">{achievementPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${achievementPercentage}%` }}></div>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">Active Projects</span>
                <Activity className="text-purple-500" size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-purple-600">{metrics.projects}</div>
              <div className="mt-2 text-sm text-gray-500">Across all schemes</div>
            </div>

            {/* Pumps Installed */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 text-sm font-medium">PM-KUSUM Pumps</span>
                <Droplets className="text-teal-500" size={20} />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-teal-600">{metrics.pumps}</div>
              <div className="mt-2 text-sm text-gray-500">Target: 3,000 (78.3%)</div>
            </div>
          </div>

          {/* Live Generation Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ThermometerSun className="text-orange-500" />
                Live Generation Trend ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Solar Pumps</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-500 rounded"></div>
                  <span className="text-sm text-gray-600">Rooftop</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Mini Grids</span>
                </div>
              </div>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="solarPumps" 
                    name="Solar Pumps" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rooftopSolar" 
                    name="Rooftop Solar" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="miniGrids" 
                    name="Mini Grids" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="canalTop" 
                    name="Canal-Top Solar" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scheme Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Rooftop Solar */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Home className="text-amber-500" />
                Rooftop Solar
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Installations</span>
                  <span className="text-xl font-bold text-amber-600">{rooftopData.installations.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Capacity</span>
                  <span className="text-lg font-semibold">{rooftopData.capacity} MW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Savings</span>
                  <span className="text-lg font-semibold text-green-600">₹ {rooftopData.savings} Cr</span>
                </div>
              </div>
            </div>

            {/* Solar Mini Grids */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Battery className="text-green-500" />
                Solar Mini Grids
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Villages Electrified</span>
                  <span className="text-xl font-bold text-green-600">{miniGridsData.villages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Households</span>
                  <span className="text-lg font-semibold">{miniGridsData.households.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery Health</span>
                    <span className="font-semibold">{miniGridsData.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${miniGridsData.battery}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Maps & Additional Info */}
        <div className="space-y-4 md:space-y-6">
          {/* District-wise Energy Distribution */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-4 md:p-6 border border-blue-100 h-64 md:h-80">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                District Energy Distribution
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{districtData.reduce((a, b) => a + b.value, 0).toLocaleString()}</div>
                <div className="text-xs text-gray-600">Total Units (MW)</div>
              </div>
            </div>
            <div className="h-48 md:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e7ff" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e0e7ff', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm">
                Top 6 Districts by Installed Capacity
              </div>
            </div>
          </div>

          {/* Giridhi Solar City */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sun className="text-orange-500" />
              Giridhi Solar City
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Installed Capacity</span>
                <span className="text-xl font-bold text-orange-600">{giridhiData.capacity} MW</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Components</span>
                  <span className="font-semibold">{giridhiData.components} / 18</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(giridhiData.components / 18) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Next Milestone</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <Calendar size={16} />
                  {timeRange === 'today' ? 'May 2024' : timeRange === 'week' ? 'Apr 2024' : timeRange === 'month' ? 'Apr 2024' : timeRange === 'quarter' ? 'Mar 2024' : 'Dec 2024'}
                </span>
              </div>
            </div>
          </div>

          {/* Canal-Top Solar */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PanelTop className="text-purple-500" />
              Canal-Top Solar
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Capacity</span>
                <span className="text-xl font-bold text-purple-600">{canalTopData.capacity} MW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grid Feed-In {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</span>
                <span className="text-lg font-semibold">{canalTopData.feedIn.toLocaleString()} MWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">O&M Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-600">All Green</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* District Performance */}
        {/* <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-blue-500" />
              District Performance
            </h2>
            <div className="flex gap-2 text-xs">
              <span className="text-gray-500">Low</span>
              <span className="text-gray-500">→</span>
              <span className="text-gray-500">High</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {districtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div> */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-emerald-500" />
            PM JANMAN Projects
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Projects Completed</span>
              <span className="text-2xl font-bold text-emerald-600">{janmanData.projects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Beneficiaries</span>
              <span className="text-xl font-semibold">{janmanData.beneficiaries.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Inspection</span>
              <span className="font-semibold flex items-center gap-1">
                <Calendar size={16} />
                {timeRange === 'today' ? '12-Apr-2024' : timeRange === 'week' ? '10-Apr-2024' : timeRange === 'month' ? '05-Apr-2024' : timeRange === 'quarter' ? '01-Apr-2024' : '01-Jan-2024'}
              </span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
            <div className="text-emerald-800 text-sm">
              <div className="font-semibold mb-1">Impact Summary</div>
              <div>✓ {Math.round(janmanData.projects * 0.47)} villages covered</div>
              <div>✓ {Math.round(janmanData.beneficiaries * 0.43)} households benefited</div>
              <div>✓ 95% satisfaction rate</div>
            </div>
          </div>
        </div>

        {/* Energy Mix Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChartIcon className="text-green-500" />
            Energy Mix Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyMixData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {energyMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="text-purple-500" />
            Project Status Overview
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row - PM JANMAN & Grievance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6"> 
        {/* Grievance & Support */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 lg:col-span-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-gray-800">Grievance & Support</h2>
            <div className="flex flex-wrap gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{grievanceData.newToday}</div>
                <div className="text-sm text-gray-600">New {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : timeRange === 'quarter' ? 'This Quarter' : 'This Year'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{grievanceData.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{grievanceData.avgHours}</div>
                <div className="text-sm text-gray-600">Avg. Hours</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Complaint Types</h3>
            <div className="space-y-3">
              {complaintTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className="text-gray-700 text-sm">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm">{type.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(type.count / Math.max(...complaintTypes.map(t => t.count))) * 100}%`,
                          backgroundColor: type.color
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">✓ 85%</span> resolved within SLA
              </div>
              <button 
                onClick={() => setShowDownloadDialog(true)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-600 text-sm gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={16} />
            <span>Last Updated: {formattedDate()}</span>
          </div>
          <div className="flex items-center flex-wrap gap-3 justify-center">
            <span className="whitespace-nowrap">Jharkhand Renewable Energy Development Agency</span>
            <span className="hidden md:inline">•</span>
            <span className="whitespace-nowrap">24/7 Monitoring Active</span>
            <span className="hidden md:inline">•</span>
            <span className="whitespace-nowrap">All Systems Operational</span>
          </div>
        </div>
      </footer>
      
      {/* Export Report Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Export Dashboard Report
            </DialogTitle>
            <DialogDescription>
              Generate and download reports for renewable energy monitoring data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => handleDownload('pdf')}>
                <BarChart3 className="text-blue-600 mb-2" size={24} />
                <div className="font-medium">Summary Report</div>
                <div className="text-sm text-gray-500">Overview of all metrics</div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => handleDownload('excel')}>
                <Activity className="text-green-600 mb-2" size={24} />
                <div className="font-medium">Detailed Analysis</div>
                <div className="text-sm text-gray-500">In-depth performance data</div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => handleDownload('csv')}>
                <MapPin className="text-purple-600 mb-2" size={24} />
                <div className="font-medium">District Report</div>
                <div className="text-sm text-gray-500">Regional performance data</div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => handleDownload('json')}>
                <TrendingUp className="text-amber-600 mb-2" size={24} />
                <div className="font-medium">Financial Report</div>
                <div className="text-sm text-gray-500">Cost and savings analysis</div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-gray-500">Format: PDF, Excel, CSV, JSON</span>
              <button onClick={() => setShowExportDialog(false)} className="text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Refresh Dialog */}
      <Dialog open={showRefreshDialog} onOpenChange={setShowRefreshDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className={`text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refreshing Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            {isRefreshing ? (
              <>
                <RefreshCw className="animate-spin mx-auto mb-4 text-blue-600" size={48} />
                <p className="text-gray-600">Fetching latest data from all sources...</p>
                <div className="mt-4 space-y-2 text-left text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    SCADA data synchronized
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    GIS maps updated
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Energy metrics recalculated
                  </div>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                <p className="text-lg font-medium text-green-600">Data Refreshed Successfully!</p>
                <p className="text-gray-500 mt-2">All dashboard metrics are up to date</p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="text-amber-500" />
              System Alerts & Notifications
            </DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active (4)</TabsTrigger>
              <TabsTrigger value="resolved">Resolved (12)</TabsTrigger>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-3 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="text-red-500" size={16} />
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Pump #452 - Ranchi</div>
                      <div className="text-xs text-gray-500">Output dropped by 35%</div>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Mini Grid - Hazaribagh</div>
                      <div className="text-xs text-gray-500">Battery at 15% capacity</div>
                    </div>
                    <Badge className="bg-amber-500">Warning</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="text-amber-500" size={16} />
                    Medium Priority
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Rooftop Install - Bokaro</div>
                      <div className="text-xs text-gray-500">Scheduled maintenance due</div>
                    </div>
                    <Badge className="bg-amber-500">Pending</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Canal-Top Solar</div>
                      <div className="text-xs text-gray-500">Cleaning scheduled</div>
                    </div>
                    <Badge className="bg-blue-500">Info</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resolved" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Pump #128 - Dhanbad</TableCell>
                    <TableCell><Badge className="bg-green-500">Fixed</Badge></TableCell>
                    <TableCell>2 hours ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grid Inverter - Jamshedpur</TableCell>
                    <TableCell><Badge className="bg-green-500">Fixed</Badge></TableCell>
                    <TableCell>5 hours ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sensor Malfunction - Deoghar</TableCell>
                    <TableCell><Badge className="bg-green-500">Fixed</Badge></TableCell>
                    <TableCell>1 day ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <p className="text-gray-500 text-center py-4">View all 16 alerts in the Grievances section</p>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Download Report Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="text-blue-600" />
              Download Grievance Report
            </DialogTitle>
            <DialogDescription>
              Export complaint and grievance data for external analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Select Report Type</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="reportType" 
                    checked={selectedReportType === 'summary'}
                    onChange={() => setSelectedReportType('summary')}
                  />
                  <span>Complaint Summary (Last 30 days)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="reportType" 
                    checked={selectedReportType === 'detailed'}
                    onChange={() => setSelectedReportType('detailed')}
                  />
                  <span>Detailed Grievance Log</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="reportType" 
                    checked={selectedReportType === 'resolution'}
                    onChange={() => setSelectedReportType('resolution')}
                  />
                  <span>Resolution Time Analysis</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="reportType" 
                    checked={selectedReportType === 'district'}
                    onChange={() => setSelectedReportType('district')}
                  />
                  <span>District-wise Report</span>
                </label>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Select Format</h4>
              <div className="flex gap-4">
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleDownload('pdf')}>
                  <Download size={16} />
                  PDF
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleDownload('excel')}>
                  <Download size={16} />
                  Excel
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleDownload('csv')}>
                  <Download size={16} />
                  CSV
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
    </DashboardLayout>
  );
};

export default Index;
