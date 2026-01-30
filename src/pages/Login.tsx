import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, AlertCircle, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(t("invalidCredentials"));
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/");
    } else {
      setError(t("invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex">
      {/* Left Side - JREDA Logo */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <img 
            src="/JREDA.jpeg" 
            alt="JREDA Logo" 
            className="w-72 h-72 mx-auto mb-8 object-contain bg-white/10 rounded-3xl p-6"
          />
          <h1 className="text-6xl font-bold mb-6">JREDA</h1>
          <p className="text-2xl mb-4">
            Jharkhand Renewable Energy Development Agency
          </p>
          <p className="text-xl text-primary-foreground/70">
            {t("solarEnergyPlatform")}
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <img 
              src="/JREDA.jpeg" 
              alt="JREDA Logo" 
              className="w-40 h-40 object-contain mb-6 rounded-2xl p-4"
            />
            <h1 className="text-4xl font-bold text-foreground">JREDA</h1>
          </div>

          {/* Language Selector */}
          <div className="absolute top-4 right-4">
            <Select value={language} onValueChange={(val) => setLanguage(val as "en" | "hi")}>
              <SelectTrigger className="w-32 bg-card">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border-border/50 shadow-lg p-6">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-4xl mb-4">{t("welcomeBack")}</CardTitle>
              <CardDescription className="text-lg">{t("loginToAccount")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">{t("username")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder={t("enterUsername")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t("enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {t("signIn")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("poweredBy")} {t("govtOfJharkhand")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
