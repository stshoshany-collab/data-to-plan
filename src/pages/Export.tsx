import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/EmptyState";
import { useCases } from "@/hooks/useCases";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Goal } from "@/types/goal";
import { SessionPlan } from "@/types/session";
import { InterventionPlan } from "@/types/intervention";
import { Activity, demoActivities } from "@/types/activity";
import { Report } from "@/types/report";
import {
  buildActivityDoc,
  buildCaseDoc,
  buildGoalDoc,
  buildInterventionDoc,
  buildReportDoc,
  buildSessionDoc,
  downloadHtml,
  downloadWord,
  EXPORT_KIND_LABEL,
  ExportDocument,
  ExportKind,
  printDoc,
  toHtml,
  toPlainText,
} from "@/lib/exportDoc";
import { toast } from "sonner";
import {
  Copy,
  Download,
  FileDown,
  FileText,
  Printer,
  Search,
  Eye,
  AlertCircle,
} from "lucide-react";

const STORAGE = {
  goals: "ba-app:goals:v1",
  sessions: "ba-app:sessions:v1",
  interventions: "ba-app:interventions:v1",
  activities: "ba-app:activities:v1",
  reports: "ba-app:reports:v1",
};

const KIND_OPTIONS: { value: ExportKind; label: string }[] = [
  { value: "case", label: "מקרה" },
  { value: "goal", label: "מטרה" },
  { value: "session", label: "מערך מפגש" },
  { value: "intervention", label: "תוכנית התערבות" },
  { value: "activity", label: "פעילות" },
  { value: "report", label: "דוח" },
];

const Export = () => {
  const { cases } = useCases();
  const [goals] = useLocalStorageState<Goal[]>(STORAGE.goals, []);
  const [sessions] = useLocalStorageState<SessionPlan[]>(STORAGE.sessions, []);
  const [interventions] = useLocalStorageState<InterventionPlan[]>(STORAGE.interventions, []);
  const [activities] = useLocalStorageState<Activity[]>(STORAGE.activities, demoActivities);
  const [reports] = useLocalStorageState<Report[]>(STORAGE.reports, []);

  const [kind, setKind] = useState<ExportKind>("case");
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");

  const caseNameOf = (id?: string) =>
    cases.find((c) => c.id === id)?.name || undefined;

  /* options for current kind */
  const options = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filter = (label: string, sub?: string) => {
      if (!q) return true;
      return `${label} ${sub ?? ""}`.toLowerCase().includes(q);
    };

    switch (kind) {
      case "case":
        return cases
          .filter((c) => filter(c.name, c.educationalSetting))
          .map((c) => ({
            id: c.id,
            label: c.name || "ללא שם",
            sub: c.educationalSetting || "",
          }));
      case "goal":
        return goals
          .filter((g) => filter(g.targetBehavior, g.domain))
          .map((g) => ({
            id: g.id,
            label: g.targetBehavior || "ללא כותרת",
            sub: `${g.domain || "—"} · ${caseNameOf(g.caseId) ?? "ללא מקרה"}`,
          }));
      case "session":
        return sessions
          .filter((s) => filter(s.title, s.targetSkill))
          .map((s) => ({
            id: s.id,
            label: s.title || "מערך מפגש",
            sub: `${s.targetSkill || "—"} · ${caseNameOf(s.caseId) ?? "ללא מקרה"}`,
          }));
      case "intervention":
        return interventions
          .filter((p) => filter(p.planName, p.targetBehavior))
          .map((p) => ({
            id: p.id,
            label: p.planName || p.targetBehavior || "תוכנית",
            sub: caseNameOf(p.caseId) ?? "ללא מקרה",
          }));
      case "activity":
        return activities
          .filter((a) => filter(a.name, a.skillDomain))
          .map((a) => ({ id: a.id, label: a.name, sub: a.skillDomain }));
      case "report":
        return reports
          .filter((r) => filter(r.type, r.participants))
          .map((r) => ({
            id: r.id,
            label: r.type,
            sub: caseNameOf(r.caseId) ?? "ללא מקרה",
          }));
    }
  }, [kind, search, cases, goals, sessions, interventions, activities, reports]);

  /* reset selection when kind changes */
  useEffect(() => {
    setSelectedId("");
    setSearch("");
  }, [kind]);

  /* build the export document */
  const doc: ExportDocument | null = useMemo(() => {
    if (!selectedId) return null;
    switch (kind) {
      case "case": {
        const c = cases.find((x) => x.id === selectedId);
        return c ? buildCaseDoc(c) : null;
      }
      case "goal": {
        const g = goals.find((x) => x.id === selectedId);
        return g ? buildGoalDoc(g, caseNameOf(g.caseId)) : null;
      }
      case "session": {
        const s = sessions.find((x) => x.id === selectedId);
        return s ? buildSessionDoc(s, caseNameOf(s.caseId)) : null;
      }
      case "intervention": {
        const p = interventions.find((x) => x.id === selectedId);
        return p ? buildInterventionDoc(p, caseNameOf(p.caseId)) : null;
      }
      case "activity": {
        const a = activities.find((x) => x.id === selectedId);
        return a ? buildActivityDoc(a) : null;
      }
      case "report": {
        const r = reports.find((x) => x.id === selectedId);
        return r ? buildReportDoc(r, caseNameOf(r.caseId)) : null;
      }
    }
  }, [kind, selectedId, cases, goals, sessions, interventions, activities, reports]);

  /* preview iframe */
  const previewSrcDoc = useMemo(() => (doc ? toHtml(doc) : ""), [doc]);

  const handleCopy = async () => {
    if (!doc) return;
    try {
      await navigator.clipboard.writeText(toPlainText(doc));
      toast.success("המסמך הועתק ללוח");
    } catch {
      toast.error("העתקה נכשלה. נסי שוב.");
    }
  };

  const handlePrint = () => {
    if (!doc) return;
    try {
      printDoc(doc);
      toast.success("נפתח חלון הדפסה");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ההדפסה נכשלה");
    }
  };

  const handlePdf = () => {
    if (!doc) return;
    try {
      // Same flow as Print – user picks "Save as PDF" in the system dialog.
      printDoc(doc);
      toast.info('בחלון שנפתח – בחרי "שמירה כ-PDF" כיעד ההדפסה');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ייצוא PDF נכשל");
    }
  };

  const handleWord = () => {
    if (!doc) return;
    downloadWord(doc);
    toast.success("הקובץ הורד (Word/HTML)");
  };

  const handleHtml = () => {
    if (!doc) return;
    downloadHtml(doc);
    toast.success("קובץ HTML הורד");
  };

  return (
    <div>
      <PageHeader
        title="ייצוא"
        description="ייצוא מסמכים מקצועיים בעברית – העתקה, הדפסה, PDF ו-Word."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Selection panel */}
        <Card className="shadow-card h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">בחירת תוצר לייצוא</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>סוג תוצר</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as ExportKind)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KIND_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>חיפוש</Label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חפשי לפי שם / תחום"
                  className="pe-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>בחרי פריט ({options.length})</Label>
              {options.length === 0 ? (
                <div className="text-sm text-muted-foreground border border-dashed rounded-lg p-4 text-center">
                  אין פריטים זמינים מסוג זה.
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto space-y-1.5 pr-1">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedId(opt.id)}
                      className={`w-full text-right p-2.5 rounded-lg border transition-colors ${
                        opt.id === selectedId
                          ? "border-primary bg-primary-soft"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <p className="text-sm font-medium leading-snug line-clamp-2">{opt.label}</p>
                      {opt.sub && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{opt.sub}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview + actions */}
        <div className="space-y-4 min-w-0">
          {!doc ? (
            <EmptyState
              title="לא נבחר פריט לייצוא"
              description="בחרי סוג תוצר ופריט מהרשימה כדי לראות תצוגה מקדימה ולייצא."
              icon={<FileDown className="h-6 w-6" />}
            />
          ) : (
            <>
              <Card className="shadow-card">
                <CardContent className="p-4 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{EXPORT_KIND_LABEL(doc.kind)}</Badge>
                  <span className="text-sm font-medium truncate flex-1 min-w-0">{doc.title}</span>
                  <span className="text-xs text-muted-foreground">{doc.date}</span>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy} variant="default">
                  <Copy className="h-4 w-4" />
                  העתקה ללוח
                </Button>
                <Button onClick={handlePrint} variant="secondary">
                  <Printer className="h-4 w-4" />
                  הדפסה
                </Button>
                <Button onClick={handlePdf} variant="secondary">
                  <FileDown className="h-4 w-4" />
                  ייצוא PDF
                </Button>
                <Button onClick={handleWord} variant="outline">
                  <FileText className="h-4 w-4" />
                  ייצוא Word
                </Button>
                <Button onClick={handleHtml} variant="outline">
                  <Download className="h-4 w-4" />
                  הורדת HTML
                </Button>
              </div>

              <Card className="shadow-card overflow-hidden">
                <CardHeader className="pb-3 border-b bg-muted/40">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">תצוגה מקדימה</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    title="תצוגה מקדימה"
                    srcDoc={previewSrcDoc}
                    className="w-full bg-white"
                    style={{ height: "70vh", border: 0 }}
                  />
                </CardContent>
              </Card>

              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 border rounded-lg p-3">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  ייצוא PDF נעשה דרך חלון ההדפסה של הדפדפן –
                  בחלון שייפתח יש לבחור "שמירה כ-PDF" כיעד ההדפסה.
                  קובץ Word יורד כקובץ <code>.doc</code> שנפתח ב-Microsoft Word וב-Google Docs.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Export;
