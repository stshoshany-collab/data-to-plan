import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormSection } from "@/components/forms/FormSection";
import { RecordsSidebar } from "@/components/RecordsSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCases } from "@/hooks/useCases";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import {
  InterventionPlan,
  buildFullPlan,
  buildParentShort,
  buildStaffShort,
  createEmptyIntervention,
} from "@/types/intervention";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Copy,
  FileText,
  Users,
  Heart,
  Target,
  Shield,
  GraduationCap,
  Activity,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "ba-app:interventions:v1";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const Interventions = () => {
  const { cases } = useCases();
  const [plans, setPlans] = useLocalStorageState<InterventionPlan[]>(STORAGE_KEY, []);
  const [form, setForm] = useState<InterventionPlan>(() => createEmptyIntervention());

  useEffect(() => {
    if (!form.caseId && cases.length > 0) {
      setForm((p) => ({ ...p, caseId: cases[0].id }));
    }
  }, [cases, form.caseId]);

  const update = <K extends keyof InterventionPlan>(
    key: K,
    value: InterventionPlan[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === form.caseId),
    [cases, form.caseId],
  );

  const casePlans = useMemo(
    () =>
      plans
        .filter((p) => p.caseId === form.caseId)
        .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)),
    [plans, form.caseId],
  );

  const newPlan = () => setForm(createEmptyIntervention(form.caseId));

  const generateFull = () => {
    if (!form.targetBehavior.trim()) {
      toast.error("יש להזין התנהגות מטרה לפני יצירת תוכנית מלאה.");
      return;
    }
    setForm((p) => ({ ...p, fullPlan: buildFullPlan(p) }));
    toast.success("נוצרה תוכנית מלאה.");
  };

  const generateStaff = () => {
    setForm((p) => ({ ...p, staffShort: buildStaffShort(p) }));
    toast.success("נוצרה גרסה מקוצרת לצוות.");
  };

  const generateParent = () => {
    setForm((p) => ({ ...p, parentShort: buildParentShort(p) }));
    toast.success("נוצרה גרסה להורים.");
  };

  const save = () => {
    if (!form.caseId) {
      toast.error("יש לבחור מקרה לפני שמירה.");
      return;
    }
    if (!form.planName.trim() && !form.targetBehavior.trim()) {
      toast.error("יש להזין שם תוכנית או התנהגות מטרה.");
      return;
    }
    const now = new Date().toISOString();
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === form.id);
      if (exists) return prev.map((p) => (p.id === form.id ? { ...form, updatedAt: now } : p));
      return [{ ...form, createdAt: now, updatedAt: now }, ...prev];
    });
    toast.success("נשמר בהצלחה", { description: "התוכנית נשמרה במאגר." });
  };

  const duplicate = () => {
    if (!form.planName.trim() && !form.targetBehavior.trim()) {
      toast.error("אין מה לשכפל – התוכנית ריקה.");
      return;
    }
    const now = new Date().toISOString();
    const copy: InterventionPlan = {
      ...form,
      id: crypto.randomUUID(),
      planName: `${form.planName || "תוכנית"} (עותק)`,
      createdAt: now,
      updatedAt: now,
    };
    setPlans((prev) => [copy, ...prev]);
    setForm(copy);
    toast.success("התוכנית שוכפלה");
  };

  const loadFromList = (id: string) => {
    const p = plans.find((x) => x.id === id);
    if (p) {
      setForm(p);
      toast("התוכנית נטענה לעריכה");
    }
  };

  const removeFromList = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    if (form.id === id) newPlan();
    toast.success("התוכנית נמחקה");
  };

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} הועתק ללוח`);
    } catch {
      toast.error("העתקה נכשלה");
    }
  };

  return (
    <>
      <PageHeader
        title="תוכניות התערבות"
        description="בנה תוכנית התערבות מובנית הכוללת מניעה, מיומנויות חלופיות, חיזוקים, מדידה והכללה."
        actions={
          <>
            <Button variant="outline" onClick={newPlan}>
              <Plus className="ms-2 h-4 w-4" />
              תוכנית חדשה
            </Button>
            <Button onClick={save}>
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
                כדי לבנות תוכנית התערבות יש להוסיף קודם מקרה במסך "מקרים".
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card mb-6 bg-gradient-soft border-primary/20">
        <CardContent className="p-4 flex flex-wrap gap-2">
          <Button onClick={generateFull}>
            <FileText className="ms-2 h-4 w-4" />
            צור תוכנית מלאה
          </Button>
          <Button variant="outline" onClick={generateStaff}>
            <Users className="ms-2 h-4 w-4" />
            צור גרסה מקוצרת לצוות
          </Button>
          <Button variant="outline" onClick={generateParent}>
            <Heart className="ms-2 h-4 w-4" />
            צור גרסה להורים
          </Button>
          <span className="mx-1 hidden sm:inline-block w-px bg-border" />
          <Button variant="ghost" onClick={duplicate}>
            <Copy className="ms-2 h-4 w-4" />
            שכפל תוכנית
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <FormSection title="פרטי התוכנית" icon={<Target className="h-4 w-4" />}>
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
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="planName">שם התוכנית</Label>
                <Input
                  id="planName"
                  value={form.planName}
                  onChange={(e) => update("planName", e.target.value)}
                  placeholder="לדוגמה: הפחתת התנגדות בכניסה לשיעור"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target">התנהגות מטרה *</Label>
                <Textarea id="target" rows={2} value={form.targetBehavior}
                  onChange={(e) => update("targetBehavior", e.target.value)}
                  placeholder="ההתנהגות שאליה התוכנית מתייחסת..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objective">הגדרה אובייקטיבית של ההתנהגות</Label>
                <Textarea id="objective" rows={2} value={form.objectiveDefinition}
                  onChange={(e) => update("objectiveDefinition", e.target.value)}
                  placeholder="מה בדיוק נצפה – ניתן למדידה ולא פרשני..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hyp">השערות תפקוד</Label>
              <Textarea id="hyp" rows={2} value={form.functionHypotheses}
                onChange={(e) => update("functionHypotheses", e.target.value)}
                placeholder="בריחה, השגה, גירוי חושי, תשומת לב..." />
            </div>
          </FormSection>

          <FormSection title="רכיבי ההתערבות" icon={<Shield className="h-4 w-4" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prev">אסטרטגיות מניעה</Label>
                <Textarea id="prev" rows={3} value={form.preventionStrategies}
                  onChange={(e) => update("preventionStrategies", e.target.value)}
                  placeholder="שינויים סביבתיים, התראות, לוח שגרה..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direct">הוראה ישירה של מיומנויות חלופיות</Label>
                <Textarea id="direct" rows={3} value={form.directInstruction}
                  onChange={(e) => update("directInstruction", e.target.value)}
                  placeholder="כיצד נלמד את המיומנויות באופן מובנה..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">מיומנויות חלופיות</Label>
                <Textarea id="alt" rows={3} value={form.alternativeSkills}
                  onChange={(e) => update("alternativeSkills", e.target.value)}
                  placeholder="בקשת הפסקה, בקשת עזרה, שימוש בכרטיסיה..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reinf">חיזוקים</Label>
                <Textarea id="reinf" rows={3} value={form.reinforcers}
                  onChange={(e) => update("reinforcers", e.target.value)}
                  placeholder="סוגי חיזוק, תזמון, לוח חיזוקים..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resp">תגובת צוות מומלצת</Label>
              <Textarea id="resp" rows={3} value={form.staffResponse}
                onChange={(e) => update("staffResponse", e.target.value)}
                placeholder="כיצד יש להגיב כשההתנהגות מופיעה, ברגיעה ובאחידות..." />
            </div>
          </FormSection>

          <FormSection title="מדידה והכללה" icon={<Activity className="h-4 w-4" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meas">מדידה</Label>
                <Textarea id="meas" rows={3} value={form.measurement}
                  onChange={(e) => update("measurement", e.target.value)}
                  placeholder="תדירות, משך, אחוז הזדמנויות, כלי תיעוד..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gen">הכללה</Label>
                <Textarea id="gen" rows={3} value={form.generalization}
                  onChange={(e) => update("generalization", e.target.value)}
                  placeholder="העברה להקשרים, אנשים ומקומות נוספים..." />
              </div>
            </div>
          </FormSection>

          <FormSection title="הנחיות יישום" icon={<GraduationCap className="h-4 w-4" />}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="staffG">הנחיות לצוות</Label>
                <Textarea id="staffG" rows={4} value={form.staffGuidelines}
                  onChange={(e) => update("staffGuidelines", e.target.value)}
                  placeholder="דגשים יישומיים לאנשי הצוות..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parG">הנחיות להורים</Label>
                <Textarea id="parG" rows={4} value={form.parentGuidelines}
                  onChange={(e) => update("parentGuidelines", e.target.value)}
                  placeholder="המלצות לתמיכה ועקביות בבית..." />
              </div>
            </div>
          </FormSection>

          {/* Generated outputs */}
          {form.fullPlan && (
            <FormSection
              title="תוכנית מלאה (טקסט מקצועי)"
              icon={<FileText className="h-4 w-4" />}
              description="טיוטה לעריכה. הנוסח מכבד, לא שיפוטי, ומציין שמדובר בהשערות עבודה."
            >
              <Textarea
                rows={18}
                value={form.fullPlan}
                onChange={(e) => update("fullPlan", e.target.value)}
                className="font-medium leading-relaxed"
              />
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(form.fullPlan, "התוכנית")}>
                <Copy className="ms-2 h-4 w-4" />
                העתקה
              </Button>
            </FormSection>
          )}

          {(form.staffShort || form.parentShort) && (
            <div className="grid gap-6 md:grid-cols-2">
              {form.staffShort && (
                <FormSection title="גרסה מקוצרת לצוות" icon={<Users className="h-4 w-4" />}>
                  <Textarea
                    rows={14}
                    value={form.staffShort}
                    onChange={(e) => update("staffShort", e.target.value)}
                    className="font-medium leading-relaxed"
                  />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(form.staffShort, "גרסת הצוות")}>
                    <Copy className="ms-2 h-4 w-4" />
                    העתקה
                  </Button>
                </FormSection>
              )}
              {form.parentShort && (
                <FormSection title="גרסה להורים" icon={<Heart className="h-4 w-4" />}>
                  <Textarea
                    rows={14}
                    value={form.parentShort}
                    onChange={(e) => update("parentShort", e.target.value)}
                    className="font-medium leading-relaxed"
                  />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(form.parentShort, "גרסת ההורים")}>
                    <Copy className="ms-2 h-4 w-4" />
                    העתקה
                  </Button>
                </FormSection>
              )}
            </div>
          )}
        </div>

        <div>
          <RecordsSidebar
            heading="תוכניות שמורות"
            description={selectedCase ? `עבור: ${selectedCase.name}` : "בחרי מקרה"}
            items={casePlans.map((p) => ({
              id: p.id,
              title: p.planName || p.targetBehavior || "תוכנית ללא שם",
              subtitle: p.targetBehavior,
              meta: `עודכן ${formatDate(p.updatedAt)}`,
            }))}
            activeId={form.id}
            onSelect={loadFromList}
            onDelete={removeFromList}
            emptyText="עדיין אין תוכניות שמורות למקרה זה."
          />
        </div>
      </div>
    </>
  );
};

export default Interventions;
