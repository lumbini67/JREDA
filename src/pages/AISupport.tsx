import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Globe,
  Brain,
  Sparkles,
  Send,
  ThumbsUp,
  ThumbsDown,
  Clock,
  TrendingUp,
  Languages,
  Headphones,
  User,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const channelStats = [
  { channel: "WhatsApp", icon: MessageSquare, active: 156, resolved: 142, color: "text-success" },
  { channel: "IVR", icon: Phone, active: 45, resolved: 38, color: "text-info" },
  { channel: "Web Chat", icon: Globe, active: 78, resolved: 71, color: "text-primary" },
  { channel: "Mobile App", icon: Smartphone, active: 92, resolved: 85, color: "text-accent" },
  { channel: "Email", icon: Mail, active: 34, resolved: 30, color: "text-warning" },
];

const aiMetrics = {
  totalQueries: 2456,
  autoResolved: 789,
  avgResponseTime: 2.3,
  sentimentPositive: 78,
  sentimentNeutral: 18,
  sentimentNegative: 4,
};

const sampleConversation = [
  {
    role: "user",
    message: "मेरा सोलर पंप सुबह से काम नहीं कर रहा है",
    language: "Hindi",
    time: "10:30 AM",
  },
  {
    role: "ai",
    message: "नमस्ते! मुझे आपकी समस्या समझ में आई। कृपया मुझे बताएं:\n1. क्या डिस्प्ले पर कोई एरर कोड दिख रहा है?\n2. क्या सोलर पैनल पर धूप आ रही है?\n\nआप अपना पंप आईडी भी बताएं ताकि मैं आपके पंप की लाइव स्थिति देख सकूं।",
    language: "Hindi",
    time: "10:30 AM",
  },
  {
    role: "user",
    message: "JREDA-SPP-001 है मेरा पंप। E-12 एरर दिख रहा है।",
    language: "Hindi",
    time: "10:31 AM",
  },
  {
    role: "ai",
    message: "धन्यवाद! मैंने आपके पंप JREDA-SPP-001 की जांच की:\n\n📍 लोकेशन: कांके, रांची\n⚡ स्थिति: ऑफलाइन\n🔴 एरर: E-12 (ओवर करंट प्रोटेक्शन)\n\nयह एरर आमतौर पर पंप के पाइप में ब्लॉकेज या मोटर में समस्या के कारण आता है।\n\n✅ मैंने आपकी शिकायत दर्ज कर दी है।\n📋 टिकट नंबर: GRV-2024-1238\n👨‍🔧 तकनीशियन 4 घंटे में आपसे संपर्क करेंगे।\n\nक्या कोई और मदद चाहिए?",
    language: "Hindi",
    time: "10:31 AM",
  },
];

const AISupport = () => {
  const [inputMessage, setInputMessage] = useState("");

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI-Powered Support</h1>
            <p className="text-muted-foreground">
              LLM-powered multilingual omnichannel customer support system
            </p>
          </div>
        </div>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {channelStats.map((channel) => (
          <Card key={channel.channel}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <channel.icon className={`w-5 h-5 ${channel.color}`} />
                <span className="text-sm font-medium">{channel.channel}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold">{channel.active}</p>
                  <p className="text-xs text-muted-foreground">active</p>
                </div>
                <Badge className="bg-success/10 text-success">
                  {Math.round((channel.resolved / channel.active) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chatbot Demo */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  AI Chatbot Demo
                  <Badge className="ml-2 bg-success/10 text-success animate-pulse">Live</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Hindi / English / Santhali</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
              {/* AI Greeting */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-md p-4 max-w-[85%]">
                    <p className="text-sm">
                      नमस्ते! 🙏 मैं JREDA का AI सहायक हूं। मैं आपकी सोलर पंप संबंधित समस्याओं में मदद कर सकता हूं।
                      <br /><br />
                      Hello! I'm JREDA's AI Assistant. I can help you with solar pump related queries.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">10:29 AM</span>
                </div>
              </div>

              {/* Sample Conversation */}
              {sampleConversation.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-accent" : "bg-primary"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-accent-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-2xl p-4 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-accent text-accent-foreground ml-auto rounded-tr-md"
                        : "bg-card border border-border rounded-tl-md"
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.message}</p>
                    </div>
                    <span className={`text-xs text-muted-foreground mt-1 block ${
                      msg.role === "user" ? "text-right" : ""
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* AI Typing Indicator */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-md p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            </CardContent>
            {/* Input Area */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message in Hindi, English, or Santhali..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1"
                />
                <Button>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Yes
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  No
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Metrics */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                AI Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Auto-Resolution Rate</span>
                  <span className="font-bold">32%</span>
                </div>
                <Progress value={32} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {aiMetrics.autoResolved} queries resolved without human intervention
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Avg. Response Time</span>
                  <span className="font-bold">{aiMetrics.avgResponseTime}s</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <p className="text-sm mb-3">Sentiment Analysis</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-success">Positive</span>
                    <span className="text-xs font-medium">{aiMetrics.sentimentPositive}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                    <div className="bg-success" style={{ width: `${aiMetrics.sentimentPositive}%` }} />
                    <div className="bg-warning" style={{ width: `${aiMetrics.sentimentNeutral}%` }} />
                    <div className="bg-destructive" style={{ width: `${aiMetrics.sentimentNegative}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Neutral: {aiMetrics.sentimentNeutral}%</span>
                    <span>Negative: {aiMetrics.sentimentNegative}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">AI Capabilities (SOW)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">Multilingual NLP (Hindi, English, Santhali)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">Real-time sentiment & emotion detection</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">Auto ticket classification & routing</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">Enquiry vs Complaint differentiation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">SLA-based escalation & alerts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span className="text-sm">24×7 ethical voice avatars</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Headphones className="w-5 h-5 text-info" />
                Human Escalation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl bg-info/5 border border-info/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pending with Agents</span>
                  <Badge className="bg-warning/10 text-warning">12</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complex queries requiring human intervention
                </p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Queue
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AISupport;
