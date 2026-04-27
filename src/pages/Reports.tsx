import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { RecordsSidebar } from "@/components/RecordsSidebar";
import { FormSection } from "@/components/forms/FormSection";
import { useCases } from "@/hooks/useCases";
import { useCloudArrayState } from "@/hooks/useCloudArrayState";
import {
  buildReport,
  createEmptyReport,
  Report,
  REPORT_TYPES,
  ReportType,
} from "@/types/report";
import { toast } from "sonner";
import {
  BarChart3,
  Copy,
  FilePlus2,
  Sparkles,
  Save,
  Trash2,
} from "lucide-react";

const STORAGE_KEY = "ba-app:reports:v1";

const Reports = () => {
  const { cases } = useCases();
  const [reports, setReports] = useCloudArrayState<Report>("reports", STORAGE_KEY, []);
  const [draft, setDraft] = useState<Report>(() => createEmptyReport());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const caseName = useMemo(
    () => cases.find((c) => c.id === draft.caseId)?.name ?? "",
    [cases, draft.caseId],
  );

  const update = <K extends keyof Report>(k: K, v: Report[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const newDraft = () => {
    setDraft(createEmptyReport());
    setActiveId(null);
  };

  const generate = () => {
    const text = buildReport(draft, caseName);
    setDraft((d) => ({ ...d, generatedText: text }));
    toast.success("הדוח נוצר. ניתן לערוך בתיבת הפלט.");
  };

  const save = () => {
    const final: Report = {
      ...draft,
      generatedText: draft.generatedText || buildReport(draft, caseName),
      updatedAt: new Date().toISOString(),
    };
    setReports((prev) => {
      const exists = prev.some((r) => r.id === final.id);
      return exists ? prev.map((r) => (r.id === final.id ? final : r)) : [final, ...prev];
    });
    setDraft(final);
    setActiveId(final.id);
    toast.success("נשמר בהצלחה");
  };

  const loadReport = (id: string) => {
    const r = reports.find((x) => x.id === id);
    if (!r) return;
    setDraft({ ...r });
    setActiveId(id);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setReports((prev) => prev.filter((r) => r.id !== pendingDelete));
    if (activeId === pendingDelete) newDraft();
    setPendingDelete(null);
    toast.success("הדוח נמחק");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft.generatedText);
      toast.success("הדוח הועתק ללוח");
    } catch {
      toast.error("העתקה נכשלה");
    }
  };

  return (
    <div>
      <PageHeader
        title="דוחות"
        description="בונה דוחות מקצועי – בחרי סוג דוח, מלאי שדות וצרי דוח מוכן להעתקה."
        actions={
          <Button onClick={newDraft} variant="outline">
            <FilePlus2 className="h-4 w-4" />
            דוח חדש
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <FormSection
            title="פרטי דוח"
            description="סוג הדוח, תאריך, מקרה ונוכחים"
            icon={<BarChart3 className="h-4 w-4" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>סוג דוח</Label>
                <Select
                  value={draft.type}
                  onValueChange={(v) => update("type", v as ReportType)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>תאריך</Label>
                <Input
                  type="date"
                  value={draft.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>מקרה</Label>
                <Select
                  value={draft.caseId || "__none__"}
                  onValueChange={(v) => update("caseId", v === "__none__" ? "" : v)}
                >
                  <SelectTrigger><SelectValue placeholder="בחרי מקרה" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— ללא שיוך —</SelectItem>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || "ללא שם"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>נוכחים</Label>
                <Input
                  value={draft.participants}
                  onChange={(e) => update("participants", e.target.value)}
                  placeholder="למשל: ההורים, מחנכת, יועצת"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="תוכן הדוח">
            <div className="grid gap-4">
              <Field
                label="מטרות"
                value={draft.goals}
                onChange={(v) => update("goals", v)}
                placeholder="המטרות שעמדו במרכז המפגש/התקופה"
              />
              <Field
                label="מה נעשה"
                value={draft.whatWasDone}
                onChange={(v) => update("whatWasDone", v)}
                placeholder="תיאור הפעולות, ההתערבויות והפעילויות"
              />
              <Field
                label="תגובת הילד/ה"
                value={draft.childResponse}
                onChange={(v) => update("childResponse", v)}
                placeholder="תיאור עובדתי של תגובת הילד/ה לאורך המפגש"
              />
              <Field
                label="תוצאות"
                value={draft.results}
                onChange={(v) => update("results", v)}
                placeholder="תוצאות נצפות, נתונים, מגמות"
              />
              <Field
                label="מסקנות"
                value={draft.conclusions}
                onChange={(v) => update("conclusions", v)}
                placeholder="מסקנות מקצועיות בלשון לא שיפוטית"
              />
              <Field
                label="המלצות להמשך"
                value={draft.recommendations}
                onChange={(v) => update("recommendations", v)}
                placeholder="צעדים מומלצים, משימות והמלצות לכלל המעורבים"
              />
            </div>
          </FormSection>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generate}>
              <Sparkles className="h-4 w-4" />
              צור דוח מקצועי
            </Button>
            <Button onClick={save} variant="secondary">
              <Save className="h-4 w-4" />
              שמירת דוח
            </Button>
          </div>

          <FormSection
            title="פלט הדוח"
            description="ניתן לערוך ידנית ולהעתיק"
          >
            <Textarea
              value={draft.generatedText}
              onChange={(e) => update("generatedText", e.target.value)}
              rows={16}
              dir="rtl"
              className="font-mono text-sm leading-relaxed"
              placeholder="לחצי על 'צור דוח מקצועי' כדי לייצר טקסט בעברית, מוכן להעתקה."
            />
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={copy}
                disabled={!draft.generatedText}
              >
                <Copy className="h-4 w-4" />
                העתקת הדוח
              </Button>
            </div>
          </FormSection>
        </div>

        <div className="space-y-4">
          <RecordsSidebar
            heading="דוחות שמורים"
            description={`${reports.length} דוחות`}
            items={reports.map((r) => ({
              id: r.id,
              title: r.type,
              subtitle: cases.find((c) => c.id === r.caseId)?.name || "ללא שיוך",
              meta: new Date(r.date).toLocaleDateString("he-IL"),
            }))}
            activeId={activeId ?? undefined}
            onSelect={loadReport}
            onDelete={(id) => setPendingDelete(id)}
            emptyText="אין דוחות שמורים עדיין."
          />
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת דוח</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את הדוח לצמיתות. האם להמשיך?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              <Trash2 className="h-4 w-4" />
              מחיקה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      dir="rtl"
    />
  </div>
);

export default Reports;
