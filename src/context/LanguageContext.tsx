import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "hi";

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Common
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  scadaMonitoring: { en: "SCADA Monitoring", hi: "स्काडा निगरानी" },
  scadaManagement: { en: "SCADA Management", hi: "स्काडा प्रबंधन" },
  userManagement: { en: "User Management", hi: "उपयोगकर्ता प्रबंधन" },
  reports: { en: "Reports", hi: "रिपोर्ट" },
  settings: { en: "Settings", hi: "सेटिंग्स" },
  grievances: { en: "Grievances", hi: "शिकायतें" },
  devices: { en: "Devices", hi: "उपकरण" },
  logout: { en: "Logout", hi: "लॉग आउट" },
  login: { en: "Login", hi: "लॉग इन" },
  
  // Login Page
  welcomeBack: { en: "Welcome Back", hi: "वापसी पर स्वागत है" },
  loginToAccount: { en: "Login to your account", hi: "अपने खाते में लॉग इन करें" },
  username: { en: "Username", hi: "उपयोगकर्ता नाम" },
  password: { en: "Password", hi: "पासवर्ड" },
  enterUsername: { en: "Enter your username", hi: "अपना उपयोगकर्ता नाम दर्ज करें" },
  enterPassword: { en: "Enter your password", hi: "अपना पासवर्ड दर्ज करें" },
  signIn: { en: "Sign In", hi: "साइन इन करें" },
  invalidCredentials: { en: "Invalid username or password", hi: "अमान्य उपयोगकर्ता नाम या पासवर्ड" },
  
  // Dashboard
  totalSolarPumps: { en: "Total Solar Pumps", hi: "कुल सोलर पंप" },
  energyGeneratedToday: { en: "Energy Generated Today", hi: "आज की ऊर्जा उत्पादन" },
  activeBeneficiaries: { en: "Active Beneficiaries", hi: "सक्रिय लाभार्थी" },
  openGrievances: { en: "Open Grievances", hi: "खुली शिकायतें" },
  lastUpdated: { en: "Last updated", hi: "अंतिम अपडेट" },
  
  // Device Types
  solarPump: { en: "Solar Pump", hi: "सोलर पंप" },
  miniGrid: { en: "Mini Grid", hi: "मिनी ग्रिड" },
  rooftopSolar: { en: "Rooftop Solar", hi: "रूफटॉप सोलर" },
  highMast: { en: "High Mast", hi: "हाई मास्ट" },
  
  // Grievance
  createTicket: { en: "Create Ticket", hi: "टिकट बनाएं" },
  ticketStatus: { en: "Ticket Status", hi: "टिकट स्थिति" },
  pending: { en: "Pending", hi: "लंबित" },
  inProgress: { en: "In Progress", hi: "प्रगति में" },
  resolved: { en: "Resolved", hi: "समाधान हो गया" },
  closed: { en: "Closed", hi: "बंद" },
  
  // Ticket Form
  yourName: { en: "Your Name", hi: "आपका नाम" },
  mobileNumber: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  email: { en: "Email", hi: "ईमेल" },
  selectDistrict: { en: "Select District", hi: "जिला चुनें" },
  selectSite: { en: "Select Site", hi: "साइट चुनें" },
  dueDate: { en: "Due Date", hi: "देय तिथि" },
  issueDescription: { en: "Solar Power Plant Name and Issue Description", hi: "सोलर पावर प्लांट का नाम और समस्या विवरण" },
  priorityLevel: { en: "Priority Level", hi: "प्राथमिकता स्तर" },
  fromDate: { en: "From Date", hi: "तारीख से" },
  contractor: { en: "Contractor", hi: "ठेकेदार" },
  uploadImages: { en: "Upload Images", hi: "छवियां अपलोड करें" },
  submit: { en: "Submit", hi: "जमा करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  
  // Priority
  low: { en: "Low", hi: "कम" },
  medium: { en: "Medium", hi: "मध्यम" },
  high: { en: "High", hi: "उच्च" },
  critical: { en: "Critical", hi: "गंभीर" },
  
  // Settings
  languageSettings: { en: "Language Settings", hi: "भाषा सेटिंग्स" },
  selectLanguage: { en: "Select Language", hi: "भाषा चुनें" },
  english: { en: "English", hi: "अंग्रेजी" },
  hindi: { en: "Hindi", hi: "हिंदी" },
  saveChanges: { en: "Save Changes", hi: "परिवर्तन सहेजें" },
  
  // Admin
  allTickets: { en: "All Tickets", hi: "सभी टिकट" },
  manageTickets: { en: "Manage Tickets", hi: "टिकट प्रबंधित करें" },
  searchTickets: { en: "Search tickets...", hi: "टिकट खोजें..." },
  filterByStatus: { en: "Filter by Status", hi: "स्थिति के अनुसार फ़िल्टर करें" },
  updateStatus: { en: "Update Status", hi: "स्थिति अपडेट करें" },
  resolve: { en: "Resolve", hi: "समाधान करें" },
  close: { en: "Close", hi: "बंद करें" },

  // Chatbot
  chatbotTitle: { en: "JREDA Support", hi: "जेरेडा सहायता" },
  chatbotWelcome: { en: "Hello! How can I help you today?", hi: "नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूं?" },
  typeMessage: { en: "Type your message...", hi: "अपना संदेश लिखें..." },
  
  // User Dashboard
  myDevices: { en: "My Devices", hi: "मेरे उपकरण" },
  myTickets: { en: "My Tickets", hi: "मेरी टिकट" },
  deviceDashboard: { en: "Device Dashboard", hi: "उपकरण डैशबोर्ड" },
  
  // Misc
  poweredBy: { en: "Powered by", hi: "द्वारा संचालित" },
  govtOfJharkhand: { en: "Govt. of Jharkhand", hi: "झारखंड सरकार" },
  solarEnergyPlatform: { en: "Solar Energy Platform", hi: "सोलर ऊर्जा प्लेटफॉर्म" },
  all: { en: "All", hi: "सभी" },
  allDistricts: { en: "All Districts", hi: "सभी जिले" },
  active: { en: "Active", hi: "सक्रिय" },
  inactive: { en: "Inactive", hi: "निष्क्रिय" },
  online: { en: "Online", hi: "ऑनलाइन" },
  offline: { en: "Offline", hi: "ऑफलाइन" },
  viewDetails: { en: "View Details", hi: "विवरण देखें" },
  actions: { en: "Actions", hi: "कार्रवाई" },
  noTicketsFound: { en: "No tickets found", hi: "कोई टिकट नहीं मिला" },
  ticketCreatedSuccess: { en: "Ticket created successfully!", hi: "टिकट सफलतापूर्वक बनाया गया!" },
  emailSent: { en: "Email notification sent to district officer", hi: "जिला अधिकारी को ईमेल सूचना भेजी गई" },

  // Energy Units & Metrics
  energyGeneration: { en: "Energy Generation", hi: "ऊर्जा उत्पादन" },
  mwh: { en: "MWh", hi: "मेगावाट घंटा" },
  mw: { en: "MW", hi: "मेगावाट" },
  kwh: { en: "kWh", hi: "किलोवाट घंटा" },
  kw: { en: "kW", hi: "किलोवाट" },
  liveSystemMetrics: { en: "Live System Metrics", hi: "लाइव सिस्टम मेट्रिक्स" },
  realTime: { en: "Real-time", hi: "वास्तविक समय" },
  actual: { en: "Actual", hi: "वास्तविक" },
  target: { en: "Target", hi: "लक्ष्य" },
  avgIrradiance: { en: "Avg. Irradiance", hi: "औसत विकिरण" },
  ambientTemp: { en: "Ambient Temp", hi: "परिवेशन तापमान" },
  waterFlow: { en: "Water Flow", hi: "पानी का प्रवाह" },
  gridFreq: { en: "Grid Freq", hi: "ग्रिड आवृत्ति" },
  windSpeed: { en: "Wind Speed", hi: "हवा की गति" },
  avgSoc: { en: "Avg. SoC", hi: "औसत SoC" },
  
  // Notifications
  notifications: { en: "Notifications", hi: "सूचनाएं" },
  newGrievanceReceived: { en: "New Grievance Received", hi: "नई शिकायत प्राप्त हुई" },
  solarPumpMalfunction: { en: "Solar pump malfunction reported in", hi: "में सोलर पंप खराबी की रिपोर्ट" },
  systemAlert: { en: "System Alert", hi: "सिस्टम अलर्ट" },
  pumpsOffline: { en: "pumps offline in", hi: "पंप बंद हैं" },
  dailyReportReady: { en: "Daily Report Ready", hi: "दैनिक रिपोर्ट तैयार" },
  energyGenerationReport: { en: "energy generation report", hi: "ऊर्जा उत्पादन रिपोर्ट" },
  
  // User Menu
  adminUser: { en: "Admin User", hi: "व्यवस्थापक उपयोगकर्ता" },
  myAccount: { en: "My Account", hi: "मेरा खाता" },
  profile: { en: "Profile", hi: "प्रोफाइल" },
  logOut: { en: "Log out", hi: "लॉग आउट करें" },
  systemOnline: { en: "System Online", hi: "सिस्टम ऑनलाइन" },
  
  // Sidebar
  collapse: { en: "Collapse", hi: "संक्षिप्त करें" },
  expand: { en: "Expand", hi: "विस्तार करें" },
  
  // Dashboard Page
  pmKusum: { en: "PM-KUSUM Component-B Solar Pump Monitoring System", hi: "पीएम-कुसुम कॉम्पोनेन्ट-बी सोलर पंप निगरानी प्रणाली" },
  thisMonth: { en: "this month", hi: "इस महीने" },
  vsYesterday: { en: "vs yesterday", hi: "बनाम कल" },
  ofInstalled: { en: "of installed", hi: "स्थापित का" },
  fromLastWeek: { en: "from last week", hi: "पिछले सप्ताह से" },
  
  // Status Updates
  statusUpdated: { en: "Status Updated", hi: "स्थिति अपडेट की गई" },
  statusChangedTo: { en: "Ticket status changed to", hi: "टिकट स्थिति बदलकर" },
  markInProgress: { en: "Mark In Progress", hi: "प्रगति में चिह्नित करें" },
  markResolved: { en: "Mark Resolved", hi: "समाधान किया गया चिह्नित करें" },
  markClosed: { en: "Mark Closed", hi: "बंद किया गया चिह्नित करें" },

  // Districts
  ranchi: { en: "Ranchi", hi: "रांची" },
  dhanbad: { en: "Dhanbad", hi: "धनबाद" },
  bokaro: { en: "Bokaro", hi: "बोकारो" },
  jamshedpur: { en: "Jamshedpur", hi: "जमशेदपुर" },
  hazaribagh: { en: "Hazaribagh", hi: "हजारीबाग" },
  giridih: { en: "Giridih", hi: "गिरिडीह" },
  deoghar: { en: "Deoghar", hi: "देवघर" },
  dumka: { en: "Dumka", hi: "दुमका" },
  simdega: { en: "Simdega", hi: "सिमडेगा" },
  palamu: { en: "Palamu", hi: "पलामू" },
  latehar: { en: "Latehar", hi: "लातेहार" },
  gumla: { en: "Gumla", hi: "गुमला" },
  chaibasa: { en: "Chaibasa", hi: "चाईबासा" },

  // User Management
  userRoleManagement: { en: "User & Role Management", hi: "उपयोगकर्ता और भूमिका प्रबंधन" },
  hierarchicalAccess: { en: "Hierarchical access control for organizations, users, and permissions", hi: "संगठनों, उपयोगकर्ताओं और अनुमतियों के लिए पदानुक्रमित पहुंच नियंत्रण" },
  addNewUser: { en: "Add New User", hi: "नया उपयोगकर्ता जोड़ें" },
  userRoles: { en: "User Roles", hi: "उपयोगकर्ता भूमिकाएं" },
  registeredFarmers: { en: "Registered Farmers", hi: "पंजीकृत किसान" },
  rolesPermissions: { en: "Roles & Permissions", hi: "भूमिकाएं और अनुमतियां" },
  districtAccess: { en: "District Access", hi: "जिला पहुंच" },
  searchUsers: { en: "Search users by name, email, or organization...", hi: "नाम, ईमेल या संगठन द्वारा उपयोगकर्ताओं को खोजें..." },
  filterByRole: { en: "Filter by Role", hi: "भूमिका द्वारा फ़िल्टर करें" },
  allRoles: { en: "All Roles", hi: "सभी भूमिकाएं" },
  districtAccessLabel: { en: "District Access", hi: "जिला पहुंच" },
  lastLogin: { en: "Last Login", hi: "अंतिम लॉगिन" },
  user: { en: "User", hi: "उपयोगकर्ता" },
  stateImplementingAgency: { en: "State Implementing Agency", hi: "राज्य कार्यान्वयन एजेंसी" },
  statePsuDiscom: { en: "State PSU (DISCOM)", hi: "राज्य पीएसयू (डिस्कॉम)" },
  empanelledAgency: { en: "Empanelled Agency", hi: "सूचीबद्ध एजेंसी" },
  nationalAgency: { en: "National Agency", hi: "राष्ट्रीय एजेंसी" },
  admin: { en: "Admin", hi: "व्यवस्थापक" },
  stateOfficer: { en: "State Officer", hi: "राज्य अधिकारी" },
  discomOfficer: { en: "DISCOM Officer", hi: "डिस्कॉम अधिकारी" },
  agencyManager: { en: "Agency Manager", hi: "एजेंसी प्रबंधक" },
  fieldTechnician: { en: "Field Technician", hi: "फील्ड तकनीशियन" },
  consumerFarmer: { en: "Consumer (Farmer)", hi: "उपभोक्ता (किसान)" },
  fullSystemAccess: { en: "Full System Access", hi: "पूर्ण सिस्टम एक्सेस" },
  configuration: { en: "Configuration", hi: "कॉन्फ़िगरेशन" },
  viewAllData: { en: "View All Data", hi: "सभी डेटा देखें" },
  approveApplications: { en: "Approve Applications", hi: "आवेदन स्वीकृत करें" },
  generateReports: { en: "Generate Reports", hi: "रिपोर्ट बनाएं" },
  manageGrievances: { en: "Manage Grievances", hi: "शिकायतें प्रबंधित करें" },
  viewDistrictData: { en: "View District Data", hi: "जिला डेटा देखें" },
  meterDataAccess: { en: "Meter Data Access", hi: "मीटर डेटा एक्सेस" },
  billingIntegration: { en: "Billing Integration", hi: "बिलिंग एकीकरण" },
  viewAgencyData: { en: "View Agency Data", hi: "एजेंसी डेटा देखें" },
  submitReports: { en: "Submit Reports", hi: "रिपोर्ट जमा करें" },
  manageTechnicians: { en: "Manage Technicians", hi: "तकनीशियन प्रबंधित करें" },
  mobileAppAccess: { en: "Mobile App Access", hi: "मोबाइल ऐप एक्सेस" },
  surveySubmission: { en: "Survey Submission", hi: "सर्वे जमा करें" },
  photoUpload: { en: "Photo Upload", hi: "फोटो अपलोड" },
  viewOwnPumpData: { en: "View Own Pump Data", hi: "अपना पंप डेटा देखें" },
  submitGrievances: { en: "Submit Grievances", hi: "शिकायतें जमा करें" },
  pushNotifications: { en: "Push Notifications", hi: "पुश सूचनाएं" },
  roleBasedAccess: { en: "Role-Based Access Control", hi: "भूमिका-आधारित पहुंच नियंत्रण" },
  districtLevelAccess: { en: "District-Level Access Configuration", hi: "जिला-स्तरीय पहुंच कॉन्फ़िगरेशन" },
  districtAccessDescription: { en: "Configure which districts each organization and user can access. Component-B access is managed at the district level.", hi: "कॉन्फ़िगर करें कि प्रत्येक संगठन और उपयोगकर्ता किन जिलों तक पहुंच सकता है। कॉम्पोनेन्ट-बी पहुंच जिला स्तर पर प्रबंधित की जाती है।" },
  configure: { en: "Configure", hi: "कॉन्फ़िगर करें" },
  manage: { en: "Manage", hi: "प्रबंधित करें" },
  usersCount: { en: "users", hi: "उपयोगकर्ता" },
  standard: { en: "Standard", hi: "मानक" },
  
  // Form fields
  fillDetails: { en: "Fill in the details to create a new support ticket", hi: "नई सहायता टिकट बनाने के लिए विवरण भरें" },
  uploadImagesDescription: { en: "Upload one or more images related to the issue", hi: "समस्या से संबंधित एक या अधिक छवियां अपलोड करें" },
  searchPlaceholder: { en: "Search pumps, grievances, locations...", hi: "पंप, शिकायतें, स्थान खोजें..." },
  systemUsers: { en: "System Users", hi: "सिस्टम उपयोगकर्ता" },
  role: { en: "Role", hi: "भूमिका" },
  organization: { en: "Organization", hi: "संगठन" },
  status: { en: "Status", hi: "स्थिति" },
  districtWiseStatus: { en: "District-wise Status", hi: "जिला-वार स्थिति" },
  uptime: { en: "Uptime", hi: "अपटाइम" },
  recentGrievances: { en: "Recent Grievances", hi: "हाल की शिकायतें" },
  
  // Grievance Titles
  solarPumpNotFunctioning: { en: "Solar pump not functioning", hi: "सोलर पंप काम नहीं कर रहा है" },
  lowWaterOutput: { en: "Low water output", hi: "कम पानी का उत्पादन" },
  controllerDisplayIssue: { en: "Controller display issue", hi: "कंट्रोलर डिस्पले समस्या" },
  inverterOverheating: { en: "Inverter overheating", hi: "इनवर्टर अधिक गर्म हो रहा है" },
  
  // Reports Page
  generateExportReports: { en: "Generate and export SCADA device performance reports", hi: "स्काडा उपकरण प्रदर्शन रिपोर्ट बनाएं और निर्यात करें" },
  exportPdf: { en: "Export PDF", hi: "PDF निर्यात करें" },
  exportExcel: { en: "Export Excel", hi: "Excel निर्यात करें" },
  print: { en: "Print", hi: "प्रिंट करें" },
  reportFilters: { en: "Report Filters", hi: "रिपोर्ट फ़िल्टर" },
  selectDevice: { en: "Select device", hi: "उपकरण चुनें" },
  allDevices: { en: "All Devices", hi: "सभी उपकरण" },
  selectType: { en: "Select type", hi: "प्रकार चुनें" },
  allTypes: { en: "All Types", hi: "सभी प्रकार" },
  totalDevices: { en: "Total Devices", hi: "कुल उपकरण" },
  totalCapacity: { en: "Total Capacity", hi: "कुल क्षमता" },
  onlineRate: { en: "Online Rate", hi: "ऑनलाइन दर" },
  summaryReport: { en: "Summary Report", hi: "सारांश रिपोर्ट" },
  individualReports: { en: "Individual Reports", hi: "व्यक्तिगत रिपोर्ट" },
  performanceAnalysis: { en: "Performance Analysis", hi: "प्रदर्शन विश्लेषण" },
  deviceSummaryReport: { en: "Device Summary Report", hi: "उपकरण सारांश रिपोर्ट" },
  overviewDevices: { en: "Overview of all SCADA devices with key metrics", hi: "सभी स्काडा उपकरणों का अवलोकन मुख्य मेट्रिक्स के साथ" },
  deviceId: { en: "Device ID", hi: "उपकरण आईडी" },
  name: { en: "Name", hi: "नाम" },
  capacityKw: { en: "Capacity (kW)", hi: "क्षमता (kW)" },
  todayEnergyKwh: { en: "Today Energy (kWh)", hi: "आज की ऊर्जा (kWh)" },
  totalEnergyMwh: { en: "Total Energy (MWh)", hi: "कुल ऊर्जा (MWh)" },
  downloadReport: { en: "Download Report", hi: "रिपोर्ट डाउनलोड करें" },
  comparativePerformance: { en: "Comparative performance metrics across device types", hi: "उपकरण प्रकारों में तुलनात्मक प्रदर्शन मेट्रिक्स" },
  onlineDevices: { en: "Online Devices", hi: "ऑनलाइन उपकरण" },
  avgCapacity: { en: "Avg. Capacity", hi: "औसत क्षमता" },
  devicesCount: { en: "devices", hi: "उपकरण" },
  beneficiary: { en: "Beneficiary", hi: "लाभार्थी" },
  pdfExported: { en: "PDF Exported", hi: "PDF निर्यातित" },
  pdfDownloaded: { en: "Your report has been downloaded as PDF.", hi: "आपकी रिपोर्ट PDF के रूप में डाउनलोड हो गई है।" },
  excelExported: { en: "Excel Exported", hi: "Excel निर्यातित" },
  excelDownloaded: { en: "Your report has been downloaded as Excel.", hi: "आपकी रिपोर्ट Excel के रूप में डाउनलोड हो गई है।" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("jreda-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("jreda-language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
