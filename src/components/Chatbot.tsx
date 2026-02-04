import { useState } from "react";
import { MessageCircle, X, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  links?: { label: string; url: string }[];
}

const botResponses: { keywords: string[]; response: { en: string; hi: string }; links?: { label: string; url: string }[] }[] = [
  {
    keywords: ["ticket", "grievance", "complaint", "issue", "problem"],
    response: {
      en: "I can help you with ticket-related issues. Would you like to create a new ticket or check existing ones?",
      hi: "मैं टिकट संबंधित मुद्दों में आपकी मदद कर सकता हूं। क्या आप नया टिकट बनाना चाहते हैं या मौजूदा टिकट देखना चाहते हैं?",
    },
    links: [
      { label: "Create New Ticket", url: "/user/grievances?action=create" },
      { label: "View My Tickets", url: "/user/grievances" },
    ],
  },
  {
    keywords: ["solar", "pump", "device", "equipment"],
    response: {
      en: "For solar pump or device related queries, you can check your device dashboard or create a support ticket.",
      hi: "सोलर पंप या उपकरण संबंधित प्रश्नों के लिए, आप अपना डिवाइस डैशबोर्ड देख सकते हैं या सपोर्ट टिकट बना सकते हैं।",
    },
    links: [
      { label: "Device Dashboard", url: "/user/devices" },
      { label: "Report Device Issue", url: "/user/grievances?action=create" },
    ],
  },
  {
    keywords: ["status", "check", "progress", "update"],
    response: {
      en: "You can check the status of your tickets in the Grievance Dashboard. All updates are shown there.",
      hi: "आप शिकायत डैशबोर्ड में अपने टिकट की स्थिति देख सकते हैं। सभी अपडेट वहां दिखाए जाते हैं।",
    },
    links: [{ label: "Check Ticket Status", url: "/user/grievances" }],
  },
  {
    keywords: ["contact", "help", "support", "officer"],
    response: {
      en: "Each district has a dedicated officer. When you create a ticket, the respective district officer is automatically notified via email.",
      hi: "प्रत्येक जिले में एक समर्पित अधिकारी है। जब आप टिकट बनाते हैं, तो संबंधित जिला अधिकारी को स्वचालित रूप से ईमेल द्वारा सूचित किया जाता है।",
    },
    links: [{ label: "Create Support Ticket", url: "/user/grievances?action=create" }],
  },
  {
    keywords: ["payment", "bill", "subsidy", "money"],
    response: {
      en: "For payment and subsidy related queries, please contact your district officer or visit the nearest JREDA office.",
      hi: "भुगतान और सब्सिडी संबंधित प्रश्नों के लिए, कृपया अपने जिला अधिकारी से संपर्क करें या निकटतम जेरेडा कार्यालय जाएं।",
    },
  },
  {
    keywords: ["maintenance", "repair", "fix", "broken"],
    response: {
      en: "For maintenance or repair requests, please create a ticket with detailed description and photos if possible.",
      hi: "रखरखाव या मरम्मत अनुरोधों के लिए, कृपया विस्तृत विवरण और यदि संभव हो तो फोटो के साथ एक टिकट बनाएं।",
    },
    links: [{ label: "Report Maintenance Issue", url: "/user/grievances?action=create" }],
  },
];

const defaultResponse = {
  en: "I'm here to help you with JREDA services. You can ask about tickets, devices, status updates, or any issues you're facing.",
  hi: "मैं जेरेडा सेवाओं में आपकी मदद के लिए यहां हूं। आप टिकट, उपकरण, स्थिति अपडेट, या किसी भी समस्या के बारे में पूछ सकते हैं।",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { language, t } = useLanguage();

  const getResponse = (userMessage: string): { text: string; links?: { label: string; url: string }[] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const item of botResponses) {
      if (item.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return { text: item.response[language], links: item.links };
      }
    }
    
    return { text: defaultResponse[language] };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };

    const response = getResponse(input);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      isBot: true,
      links: response.links,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        // onClick={() => setIsOpen(!isOpen)}
        onClick={() => window.location.href = 'http://122.166.66.4:5000/'}
        className={cn(
          "fixed bottom-20 right-12 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          isOpen && "scale-0"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 right-6 z-50 w-80 md:w-96 bg-card rounded-2xl shadow-2xl border border-border transition-all duration-300 overflow-hidden",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">{t("chatbotTitle")}</h3>
              <p className="text-xs text-primary-foreground/70">{t("online")}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-80 p-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{t("chatbotWelcome")}</p>
            </div>
          )}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2",
                    message.isBot
                      ? "bg-muted text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.links && (
                    <div className="mt-2 space-y-1">
                      {message.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("typeMessage")}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
