import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { NavLink } from "@/components/NavLink";
import { navItems } from "@/config/navigation";
import {
  FolderOpen,
  Target,
  CalendarDays,
  TrendingUp,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";

const stats = [
  { label: "מקרים פעילים", value: "12", icon: FolderOpen, trend: "+2 השבוע", color: "text-primary" },
  { label: "מטרות פתוחות", value: "34", icon: Target, trend: "8 הושלמו החודש", color: "text-accent" },
  { label: "מפגשים השבוע", value: "18", icon: CalendarDays, trend: "5 מתוכננים להיום", color: "text-warning" },
  { label: "התקדמות ממוצעת", value: "72%", icon: TrendingUp, trend: "+5% מהחודש שעבר", color: "text-success" },
];

const recentCases = [
  { name: "ילד א׳ – גן חובה", status: "פעיל", lastUpdate: "לפני יומיים", progress: "איסוף מידע" },
  { name: "ילדה ב׳ – כיתה א׳", status: "פעיל", lastUpdate: "אתמול", progress: "תוכנית התערבות" },
  { name: "ילד ג׳ – גן טרום חובה", status: "במעקב", lastUpdate: "לפני שבוע", progress: "ניתוח מקרה" },
];

const upcomingTasks = [
  { title: "סיכום מפגש – ילד א׳", due: "היום, 16:00", type: "מפגש" },
  { title: "כתיבת דוח התקדמות חודשי", due: "מחר", type: "דוח" },
  { title: "פגישת הורים – ילדה ב׳", due: "יום ה׳, 10:00", type: "פגישה" },
];

const Dashboard = () => {
  return (
    <>
      <PageHeader
        title="שלום, ברוכה הבאה"
        description="סקירה מהירה של המקרים, המטרות והמשימות שלך."
        actions={
          <>
            <Button variant="outline" asChild>
              <NavLink to="/cases">
                <FolderOpen className="ms-2 h-4 w-4" />
                כל המקרים
              </NavLink>
            </Button>
            <Button asChild>
              <NavLink to="/cases">
                <Plus className="ms-2 h-4 w-4" />
                מקרה חדש
              </NavLink>
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-primary/5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Recent cases */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>מקרים אחרונים</CardTitle>
              <CardDescription>המקרים הפעילים שעודכנו לאחרונה</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/cases">
                הצג הכל
                <ArrowLeft className="me-1 h-4 w-4" />
              </NavLink>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCases.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.progress}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={c.status === "פעיל" ? "default" : "secondary"}>{c.status}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {c.lastUpdate}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>משימות קרובות</CardTitle>
            <CardDescription>למעקב ולביצוע</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((t) => (
              <div key={t.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <Clock className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs text-muted-foreground">{t.due}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">פעולות מהירות</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {navItems.slice(1).map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className="group block rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-elegant hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  )}
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
