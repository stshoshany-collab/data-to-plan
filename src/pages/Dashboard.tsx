import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { NavLink } from "@/components/NavLink";
import { navItems } from "@/config/navigation";
import { useCases } from "@/hooks/useCases";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Goal } from "@/types/goal";
import { SessionPlan } from "@/types/session";
import { InterventionPlan } from "@/types/intervention";
import { Report } from "@/types/report";
import {
  FolderOpen,
  Target,
  CalendarDays,
  ClipboardList,
  Plus,
  ArrowLeft,
} from "lucide-react";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const Dashboard = () => {
  const { cases } = useCases();
  const [goals] = useLocalStorageState<Goal[]>("ba-app:goals:v1", []);
  const [sessions] = useLocalStorageState<SessionPlan[]>("ba-app:sessions:v1", []);
  const [interventions] = useLocalStorageState<InterventionPlan[]>("ba-app:interventions:v1", []);
  const [reports] = useLocalStorageState<Report[]>("ba-app:reports:v1", []);

  const stats = [
    { label: "מקרים פעילים", value: cases.length, icon: FolderOpen, color: "text-primary" },
    { label: "מטרות פתוחות", value: goals.length, icon: Target, color: "text-accent" },
    { label: "מערכי מפגש", value: sessions.length, icon: CalendarDays, color: "text-warning" },
    { label: "תוכניות + דוחות", value: interventions.length + reports.length, icon: ClipboardList, color: "text-success" },
  ];

  const recentCases = useMemo(
    () =>
      [...cases]
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
        .slice(0, 5),
    [cases],
  );

  const recentReports = useMemo(
    () =>
      [...reports]
        .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
        .slice(0, 4),
    [reports],
  );

  return (
    <>
      <PageHeader
        title="שלום, ברוכה הבאה"
        description="סקירה מהירה של המקרים, המטרות והדוחות שלך."
        actions={
          <>
            <Button variant="outline" asChild>
              <NavLink to="/cases">
                <FolderOpen className="h-4 w-4" />
                כל המקרים
              </NavLink>
            </Button>
            <Button asChild>
              <NavLink to="/cases">
                <Plus className="h-4 w-4" />
                מקרה חדש
              </NavLink>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card hover:shadow-elegant transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
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
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>מקרים אחרונים</CardTitle>
              <CardDescription>המקרים שעודכנו לאחרונה במערכת</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <NavLink to="/cases">
                הצג הכל
                <ArrowLeft className="h-4 w-4" />
              </NavLink>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCases.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                עדיין לא הוקמו מקרים. ניתן להתחיל ממסך "מקרים".
              </p>
            ) : (
              recentCases.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-medium text-sm truncate">{c.name || "ללא שם"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.educationalSetting || "ללא מסגרת"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant="secondary">{c.functioningLevel || "—"}</Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {formatDate(c.updatedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>דוחות אחרונים</CardTitle>
            <CardDescription>פעילות עדכנית בייצור דוחות</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                אין דוחות שמורים עדיין.
              </p>
            ) : (
              recentReports.map((r) => (
                <div key={r.id} className="p-3 rounded-lg bg-muted/40">
                  <p className="text-sm font-medium truncate">{r.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {cases.find((c) => c.id === r.caseId)?.name || "ללא מקרה"} · {formatDate(r.date)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

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
