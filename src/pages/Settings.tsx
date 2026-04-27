import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { toast } from "sonner";
import {
  Cloud,
  Database,
  Download,
  Lock,
  Save,
  Settings as SettingsIcon,
  Sparkles,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react";

interface ProfileSettings {
  displayName: string;
  email: string;
  organization: string;
  signature: string;
  autosave: boolean;
}

const PROFILE_KEY = "ba-app:profile:v1";

const STORAGE_KEYS = [
  "ba-app:cases:v1",
  "ba-app:cases:seeded:v1",
  "ba-app:goals:v1",
  "ba-app:sessions:v1",
  "ba-app:interventions:v1",
  "ba-app:activities:v1",
  "ba-app:reports:v1",
  "ba-app:analyses:v1",
  PROFILE_KEY,
];

const Settings = () => {
  const [profile, setProfile] = useLocalStorageState<ProfileSettings>(PROFILE_KEY, {
    displayName: "",
    email: "",
    organization: "",
    signature: "",
    autosave: true,
  });
  const [confirmReset, setConfirmReset] = useState(false);

  const update = <K extends keyof ProfileSettings>(k: K, v: ProfileSettings[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const save = () => toast.success("ההגדרות נשמרו בהצלחה");

  const exportAll = () => {
    const dump: Record<string, unknown> = {};
    for (const k of STORAGE_KEYS) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) dump[k] = JSON.parse(raw);
      } catch {
        /* ignore */
      }
    }
    const blob = new Blob([JSON.stringify(dump, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ba-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("גיבוי הנתונים הורד");
  };

  const reset = () => {
    for (const k of STORAGE_KEYS) localStorage.removeItem(k);
    setConfirmReset(false);
    toast.success("כל הנתונים נמחקו. רענני את הדף כדי לראות מצב חדש.");
  };

  return (
    <div>
      <PageHeader
        title="הגדרות"
        description="פרופיל, העדפות מערכת, גיבוי נתונים והכנה לחיבור עתידי לענן."
        actions={
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            שמירת הגדרות
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">פרופיל אישי</CardTitle>
            </div>
            <CardDescription>פרטים שיופיעו על דוחות שתפיקי</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>שם מלא</Label>
              <Input
                value={profile.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="לדוגמה: ד״ר רותי כהן"
              />
            </div>
            <div className="space-y-1.5">
              <Label>דוא״ל</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>ארגון / מסגרת</Label>
              <Input
                value={profile.organization}
                onChange={(e) => update("organization", e.target.value)}
                placeholder="שם מקום העבודה"
              />
            </div>
            <div className="space-y-1.5">
              <Label>חתימת מסמך</Label>
              <Input
                value={profile.signature}
                onChange={(e) => update("signature", e.target.value)}
                placeholder="לדוגמה: מנתחת התנהגות מוסמכת BCBA"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">העדפות מערכת</CardTitle>
            </div>
            <CardDescription>התנהגות ברירת מחדל של האפליקציה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>שמירה אוטומטית</Label>
                <p className="text-xs text-muted-foreground">
                  שמירה רציפה של טפסים תוך כדי הקלדה
                </p>
              </div>
              <Switch
                checked={profile.autosave}
                onCheckedChange={(v) => update("autosave", v)}
              />
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label>שפה</Label>
              <p className="text-sm">עברית · RTL מלא</p>
              <p className="text-xs text-muted-foreground">
                ניתן יהיה להוסיף שפות נוספות בהמשך
              </p>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label>גרסת אפליקציה</Label>
              <Badge variant="secondary">v1.0 — Local</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">נתונים וגיבוי</CardTitle>
            </div>
            <CardDescription>
              כל המידע נשמר כרגע מקומית בדפדפן (localStorage). מומלץ לגבות באופן קבוע.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={exportAll} variant="secondary">
                <Download className="h-4 w-4" />
                ייצוא גיבוי מלא (JSON)
              </Button>
              <Button onClick={() => setConfirmReset(true)} variant="destructive">
                <Trash2 className="h-4 w-4" />
                איפוס כל הנתונים
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              שימי לב: איפוס נתונים הוא בלתי הפיך ומוחק מקרים, מטרות, מפגשים, תוכניות ודוחות.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2 border-dashed bg-gradient-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">חיבורים עתידיים</CardTitle>
            </div>
            <CardDescription>
              היכולות הבאות מוכנות לחיבור בהמשך – ללא צורך בשכתוב האפליקציה
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <FutureItem
              icon={<Cloud className="h-4 w-4" />}
              title="שמירה בענן"
              text="חיבור ל-Lovable Cloud או Supabase יעביר את כל הנתונים לבסיס מאובטח עם סנכרון בין מכשירים."
            />
            <FutureItem
              icon={<Lock className="h-4 w-4" />}
              title="התחברות והרשאות"
              text="מערכת משתמשים עם תפקידים – מנתחת, צוות, הורים – ועם הרשאות מוגדרות לכל סוג פעולה."
            />
            <FutureItem
              icon={<Sparkles className="h-4 w-4" />}
              title="חיבור AI"
              text="חיבור ל-Lovable AI יעשיר את מחוללי הטקסט (SMART, תוכנית, דוח) בניסוחים מותאמים אישית."
            />
            <FutureItem
              icon={<Users className="h-4 w-4" />}
              title="שיתוף עם צוות והורים"
              text="קישורי שיתוף מאובטחים, הרשאות צפייה / עריכה, ושליחה ישירה במייל לבעלי עניין."
            />
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>איפוס כל הנתונים</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק לצמיתות את כל המקרים, המטרות, המפגשים, התוכניות והדוחות.
              לא ניתן לבטל פעולה זו. האם להמשיך?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={reset}>איפוס מלא</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const FutureItem = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-card border">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{text}</p>
    </div>
  </div>
);

export default Settings;
