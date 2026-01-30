import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, Check, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    toast({
      title: value === "en" ? "Language Changed" : "भाषा बदली गई",
      description: value === "en" ? "Application language set to English" : "एप्लिकेशन भाषा हिंदी में सेट की गई",
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
        <p className="text-muted-foreground mt-1">
          {language === "en" ? "System configuration and preferences" : "सिस्टम कॉन्फ़िगरेशन और प्राथमिकताएं"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              {t("languageSettings")}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Choose your preferred language for the application" 
                : "एप्लिकेशन के लिए अपनी पसंदीदा भाषा चुनें"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
              <div 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  language === "en" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="en" id="en" />
                  <div>
                    <Label htmlFor="en" className="text-base font-medium cursor-pointer">
                      English
                    </Label>
                    <p className="text-sm text-muted-foreground">Use English language</p>
                  </div>
                </div>
                {language === "en" && <Check className="w-5 h-5 text-primary" />}
              </div>
              
              <div 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  language === "hi" ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="hi" id="hi" />
                  <div>
                    <Label htmlFor="hi" className="text-base font-medium cursor-pointer">
                      हिंदी (Hindi)
                    </Label>
                    <p className="text-sm text-muted-foreground">हिंदी भाषा का उपयोग करें</p>
                  </div>
                </div>
                {language === "hi" && <Check className="w-5 h-5 text-primary" />}
              </div>
            </RadioGroup>

            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                {language === "en" 
                  ? "The language preference will be saved and applied across all pages of the application."
                  : "भाषा प्राथमिकता सहेजी जाएगी और एप्लिकेशन के सभी पृष्ठों पर लागू होगी।"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {language === "en" ? "Notification Preferences" : "सूचना प्राथमिकताएं"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Configure how you receive alerts and updates" 
                : "सूचनाएं और अपडेट प्राप्त करने के तरीके को कॉन्फ़िगर करें"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-medium text-sm">
                  {language === "en" ? "Email Notifications" : "ईमेल सूचनाएं"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Receive ticket updates via email" : "ईमेल के माध्यम से टिकट अपडेट प्राप्त करें"}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-medium text-sm">
                  {language === "en" ? "SMS Alerts" : "एसएमएस अलर्ट"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Get critical alerts via SMS" : "एसएमएस के माध्यम से महत्वपूर्ण अलर्ट प्राप्त करें"}
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div>
                <p className="font-medium text-sm">
                  {language === "en" ? "Push Notifications" : "पुश सूचनाएं"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Browser push notifications" : "ब्राउज़र पुश सूचनाएं"}
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {language === "en" ? "Security Status" : "सुरक्षा स्थिति"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">
                    {language === "en" ? "Session Active" : "सत्र सक्रिय"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Your session is secure" : "आपका सत्र सुरक्षित है"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">
                    {language === "en" ? "Data Encrypted" : "डेटा एन्क्रिप्टेड"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "All data is encrypted" : "सभी डेटा एन्क्रिप्टेड है"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-success/10 border border-success/30">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">
                    {language === "en" ? "Compliant" : "अनुपालन"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Meets GoI IT standards" : "भारत सरकार IT मानकों को पूरा करता है"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
