import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCases } from "@/hooks/useCases";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import {
  ABCAnalysis,
  buildAnalysisSummary,
  createEmptyAnalysis,
} from "@/types/analysis";
import { toast } from "sonner";
import {
  Brain,
  Save,
  Sparkles,
  Copy,
  Trash2,
  Plus,
  FileText,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "ba-app:analyses:v1";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Analysis = () => {
  const { cases } = useCases();
  const [analyses, setAnalyses] = useLocalStorageState<ABCAnalysis[]>(STORAGE_KEY, []);
  const [form, setForm] = useState<ABCAnalysis>(() => createEmptyAnalysis());

  // Default to the first case if none chosen yet
  useEffect(() => {
    if (!form.caseId && cases.length > 0) {
      setForm((p) => ({ ...p, caseId: cases[0].id }));
    }
  }, [cases, form.caseId]);

  const update = <K extends keyof ABCAnalysis>(key: K, value: ABCAnalysis[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === form.caseId),
    [cases, form.caseId],
  );

  const caseAnalyses = useMemo(
    () =>
      analyses
        .filter((a) => a.caseId === form.caseId)
        .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)),
    [analyses, form.caseId],
  );

  const resetForm = () => {
    setForm(createEmptyAnalysis(form.caseId));
  };

  const handleGenerate = () => {
    if (!form.caseId) {
      toast.error("יש לבחור מקרה לפני יצירת סיכום.");
      return;
    }
    if (
      !form.behavior.trim() &&
      !form.antecedent.trim() &&
      !form.consequence.trim()
    ) {
      toast.error("יש למלא לפחות שדה אחד מ-A/B/C כדי ליצור סיכום.");
      return;
    }
    const summary = buildAnalysisSummary(form, selectedCase?.name);
    setForm((p) => ({ ...p, summary, updatedAt: new Date().toISOString() }));
    toast.success("נוצרה טיוטת סיכום מקצועית.");
  };

  const handleSave = () => {
    if (!form.caseId) {
      toast.error("יש לבחור מקרה לפני שמירה.");
      return;
    }
    const now = new Date().toISOString();
    setAnalyses((prev) => {
      const exists = prev.some((a) => a.id === form.id);
      if (exists) {
        return prev.map((a) =>
          a.id === form.id ? { ...form, updatedAt: now } : a,
        );
      }
      return [{ ...form, createdAt: now, updatedAt: now }, ...prev];
    });
    toast.success("נשמר בהצלחה", { description: "ניתוח המקרה נשמר במאגר." });
  };

  const handleLoad = (a: ABCAnalysis) => {
    setForm(a);
    toast("הניתוח נטען לעריכה");
  };

  const handleDelete = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (form.id === id) resetForm();
    toast.success("הניתוח נמחק");
  };

  const handleCopySummary = async () => {
    if (!form.summary) return;
    try {
      await navigator.clipboard.writeText(form.summary);
      toast.success("הסיכום הועתק ללוח");
    } catch {
      toast.error("העתקה נכשלה");
    }
  };

  return (
    <>
      <PageHeader
        title="ניתוח מקרה"
        description="טופס ABC מקצועי לניתוח התנהגות והפקת טיוטת סיכום."
        actions={
          <>
            <Button variant="outline" onClick={resetForm}>
              <Plus className="ms-2 h-4 w-4" />
              ניתוח חדש
            </Button>
            <Button onClick={handleSave}>
              <Save className="ms-2 h-4 w-4" />
              שמירה
            </Button>
          </>
        }
      />

      {cases.length === 0 && (
        <Card className="shadow-card border-dashed mb-6 bg-warning/5">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">אין עדיין מקרים במערכת.</p>
              <p className="text-muted-foreground">
                כדי לבצע ניתוח יש להוסיף קודם מקרה במסך "מקרים".
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">פרטי הניתוח</CardTitle>
              </div>
              <CardDescription>בחרי מקרה ותעדי את האירוע באופן אובייקטיבי.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>מקרה *</Label>
                  <Select
                    value={form.caseId || undefined}
                    onValueChange={(v) => update("caseId", v)}
                    disabled={cases.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחרי מקרה" />
                    </SelectTrigger>
                    <SelectContent>
                      {cases.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name || "ללא שם"}
                          {c.educationalSetting ? ` – ${c.educationalSetting}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situation">תיאור מצב</Label>
                  <Textarea
                    id="situation"
                    rows={2}
                    value={form.situation}
                    onChange={(e) => update("situation", e.target.value)}
                    placeholder="היכן ומתי התרחש האירוע, מי היה נוכח..."
                  />
                </div>
              </div>

              {/* ABC */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="antecedent">A – מה קרה לפני</Label>
                  <Textarea
                    id="antecedent"
                    rows={4}
                    value={form.antecedent}
                    onChange={(e) => update("antecedent", e.target.value)}
                    placeholder="גירוי, דרישה, מעבר, אירוע מקדים..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="behavior">B – תיאור התנהגות (אובייקטיבי)</Label>
                  <Textarea
                    id="behavior"
                    rows={4}
                    value={form.behavior}
                    onChange={(e) => update("behavior", e.target.value)}
                    placeholder="מה בדיוק נצפה – ללא פרשנות (קם, צעק, השליך...)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consequence">C – מה קרה אחרי</Label>
                  <Textarea
                    id="consequence"
                    rows={4}
                    value={form.consequence}
                    onChange={(e) => update("consequence", e.target.value)}
                    placeholder="מה קרה מיד לאחר ההתנהגות..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="staffResponse">תגובת הצוות</Label>
                  <Textarea
                    id="staffResponse"
                    rows={2}
                    value={form.staffResponse}
                    onChange={(e) => update("staffResponse", e.target.value)}
                    placeholder="כיצד הגיב הצוות..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childResponse">תגובת הילד</Label>
                  <Textarea
                    id="childResponse"
                    rows={2}
                    value={form.childResponse}
                    onChange={(e) => update("childResponse", e.target.value)}
                    placeholder="כיצד הגיב הילד לתגובת הצוות..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="setEvents">משתנים מקדימים (Setting Events)</Label>
                <Textarea
                  id="setEvents"
                  rows={2}
                  value={form.setEvents}
                  onChange={(e) => update("setEvents", e.target.value)}
                  placeholder="עייפות, רעב, שינוי בשגרה, מחלה, אירועים בבית..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="functionHypotheses">השערות תפקוד אפשריות</Label>
                  <Textarea
                    id="functionHypotheses"
                    rows={3}
                    value={form.functionHypotheses}
                    onChange={(e) => update("functionHypotheses", e.target.value)}
                    placeholder="בריחה, השגה, גירוי חושי, תשומת לב..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternativeSkills">מיומנויות חלופיות אפשריות</Label>
                  <Textarea
                    id="alternativeSkills"
                    rows={3}
                    value={form.alternativeSkills}
                    onChange={(e) => update("alternativeSkills", e.target.value)}
                    placeholder="בקשת הפסקה, בקשת עזרה, שימוש בכרטיסיה..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRecommendations">המלצות להמשך איסוף נתונים</Label>
                <Textarea
                  id="dataRecommendations"
                  rows={2}
                  value={form.dataRecommendations}
                  onChange={(e) => update("dataRecommendations", e.target.value)}
                  placeholder="תצפיות נוספות, כלי מדידה, פרקי זמן, הקשרים נוספים..."
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="button" onClick={handleGenerate} variant="default">
                  <Sparkles className="ms-2 h-4 w-4" />
                  צור סיכום ניתוח מקרה
                </Button>
                <Button type="button" variant="outline" onClick={handleSave}>
                  <Save className="ms-2 h-4 w-4" />
                  שמירה
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated summary */}
          {form.summary && (
            <Card className="shadow-card border-primary/30">
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">טיוטת סיכום מקצועי</CardTitle>
                  </div>
                  <CardDescription>
                    הטקסט הוא טיוטה לעריכה. הניסוחים מהווים השערות עבודה ולא קביעה סופית.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopySummary}>
                  <Copy className="ms-2 h-4 w-4" />
                  העתקה
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={14}
                  value={form.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  className="font-medium leading-relaxed"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* History */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">ניתוחים שמורים</CardTitle>
              <CardDescription>
                {selectedCase ? `עבור: ${selectedCase.name}` : "בחרי מקרה כדי להציג היסטוריה"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {caseAnalyses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  עדיין אין ניתוחים שמורים למקרה זה.
                </p>
              ) : (
                caseAnalyses.map((a) => (
                  <div
                    key={a.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      a.id === form.id
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Badge variant="secondary" className="font-normal text-xs">
                        {formatDate(a.updatedAt)}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 -mt-1 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(a.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {a.behavior || a.situation || "ללא תיאור"}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => handleLoad(a)}
                    >
                      טעינה לעריכה
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Analysis;
