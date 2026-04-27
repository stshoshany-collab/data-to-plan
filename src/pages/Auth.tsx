import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Brain, Loader2 } from "lucide-react";
import { logAudit } from "@/lib/auditLog";

const emailSchema = z.string().trim().email("אימייל לא תקין").max(255);
const passwordSchema = z.string().min(8, "סיסמה חייבת לפחות 8 תווים").max(72);
const nameSchema = z.string().trim().min(1, "שדה חובה").max(120);

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/";

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [authLoading, user, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.errors[0].message : "שגיאה";
      toast.error(msg);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "אימייל או סיסמה שגויים" : error.message);
      return;
    }
    toast.success("התחברת בהצלחה");
    logAudit("signin", "auth", null, { email });
  };

  const handleForgotPassword = async () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast.error("יש להזין כתובת אימייל תקינה לפני שחזור סיסמה");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    setBusy(false);
    if (error) {
      toast.error("לא ניתן לשלוח מייל לשחזור סיסמה כרגע");
      return;
    }
    toast.success("נשלח מייל לאיפוס סיסמה. בדקי את תיבת הדואר");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      nameSchema.parse(fullName);
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.errors[0].message : "שגיאה";
      toast.error(msg);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("כתובת המייל כבר רשומה. נסי להתחבר.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("נרשמת בהצלחה!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-soft/30 via-background to-background p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-card mb-3">
            <Brain className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">ניתוח התנהגות יישומי מקדם</h1>
          <p className="text-sm text-muted-foreground mt-1">ממידע לתוכניות עבודה</p>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle>כניסה למערכת</CardTitle>
            <CardDescription>התחברי או צרי חשבון חדש כדי להמשיך</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">התחברות</TabsTrigger>
                <TabsTrigger value="signup">הרשמה</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-3 mt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-email">אימייל</Label>
                    <Input id="si-email" type="email" autoComplete="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si-password">סיסמה</Label>
                    <Input id="si-password" type="password" autoComplete="current-password" value={password}
                      onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    התחברות
                  </Button>
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-xs text-muted-foreground"
                    onClick={handleForgotPassword}
                    disabled={busy}
                  >
                    שכחת סיסמה?
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3 mt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">שם מלא</Label>
                    <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">אימייל</Label>
                    <Input id="su-email" type="email" autoComplete="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} required dir="ltr" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-password">סיסמה (לפחות 8 תווים)</Label>
                    <Input id="su-password" type="password" autoComplete="new-password" value={password}
                      onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                    יצירת חשבון
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              המידע מאוחסן באופן מאובטח. כל משתמש רואה רק את הנתונים שלו.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
