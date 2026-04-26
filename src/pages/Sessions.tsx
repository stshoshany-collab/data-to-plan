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
  SessionPlan,
  applySessionTemplate,
  buildSessionParentVersion,
  buildSessionStaffVersion,
  createEmptySession,
} from "@/types/session";
import { toast } from "sonner";
import {
  Plus,
  Save,
  Copy,
  Sparkles,
  Users,
  Heart,
  CalendarDays,
  Wand2,
  Layers,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "ba-app:sessions:v1";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const Sessions = () => {
  const { cases } = useCases();
  const [sessions, setSessions] = useLocalStorageState<SessionPlan[]>(STORAGE_KEY, []);
  const [form, setForm] = useState<SessionPlan>(() => createEmptySession());

  useEffect(() => {
    if (!form.caseId && cases.length > 0) {
      setForm((p) => ({ ...p, caseId: cases[0].id }));
    }
  }, [cases, form.caseId]);

  const update = <K extends keyof SessionPlan>(key: K, value: SessionPlan[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const selectedCase = useMemo(
    () => cases.find((c) => c.id === form.caseId),
    [cases, form.caseId],
  );

  const caseSessions = useMemo(
    () =>
      sessions
        .filter((s) => s.caseId === form.caseId)
        .sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1)),
    [sessions, form.caseId],
  );

  const newPlan = () => setForm(createEmptySession(form.caseId));

  const applyTemplate = (variant: "20" | "45") => {
    setForm((p) => applySessionTemplate(p, variant));
    toast.success(`הוחל מבנה מערך של ${variant} דקות`, {
      description: "השדות הריקים מולאו בתבנית מקצועית. ניתן לערוך לפי הצורך.",
    });
  };

  const generateStaff = () => {
    setForm((p) => ({ ...p, staffVersion: buildSessionStaffVersion(p) }));
    toast.success("נוצרה גרסה לצוות.");
  };

  const generateParent = () => {
    setForm((p) => ({ ...p, parentVersion: buildSessionParentVersion(p) }));
    toast.success("נוצרה גרסה להורים.");
  };

  const save = () => {
    if (!form.caseId) {
      toast.error("יש לבחור מקרה לפני שמירה.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("יש להזין כותרת למערך.");
      return;
    }
    const now = new Date().toISOString();
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === form.id);
      if (exists) return prev.map((s) => (s.id === form.id ? { ...form, updatedAt: now } : s));
      return [{ ...form, createdAt: now, updatedAt: now }, ...prev];
    });
    toast.success("נשמר בהצלחה", { description: "מערך המפגש נשמר במאגר." });
  };

  const duplicate = () => {
    if (!form.title.trim() && !form.targetSkill.trim()) {
      toast.error("אין מה לשכפל – המערך ריק.");
      return;
    }
    const now = new Date().toISOString();
    const copy: SessionPlan = {
      ...form,
      id: crypto.randomUUID(),
      title: `${form.title || "מערך"} (עותק)`,
      createdAt: now,
      updatedAt: now,
    };
    setSessions((prev) => [copy, ...prev]);
    setForm(copy);
    toast.success("המערך שוכפל");
  };

  const loadFromList = (id: string) => {
    const s = sessions.find((x) => x.id === id);
    if (s) {
      setForm(s);
      toast("המערך נטען לעריכה");
    }
  };

  const removeFromList = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (form.id === id) newPlan();
    toast.success("המערך נמחק");
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
        title="מערכי מפגש"
        description="בנה מערך מפגש מקצועי – פתיחה, ויסות, פעילות מרכזית, תרגול, הכללה וסיכום."
        actions={
          <>
            <Button variant="outline" onClick={newPlan}>
              <Plus className="ms-2 h-4 w-4" />
              מערך חדש
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
                כדי לבנות מערך מפגש יש להוסיף קודם מקרה במסך "מקרים".
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action toolbar */}
      <Card className="shadow-card mb-6 bg-gradient-soft border-primary/20">
        <CardContent className="p-4 flex flex-wrap gap-2">
          <Button variant="default" onClick={() => applyTemplate("20")}>
            <Wand2 className="ms-2 h-4 w-4" />
            צור מערך 20 דקות
          </Button>
          <Button variant="default" onClick={() => applyTemplate("45")}>
            <Wand2 className="ms-2 h-4 w-4" />
            צור מערך 45 דקות
          </Button>
          <span className="mx-1 hidden sm:inline-block w-px bg-border" />
          <Button variant="outline" onClick={generateStaff}>
            <Users className="ms-2 h-4 w-4" />
            הפק גרסת צוות
          </Button>
          <Button variant="outline" onClick={generateParent}>
            <Heart className="ms-2 h-4 w-4" />
            הפק גרסת הורים
          </Button>
          <span className="mx-1 hidden sm:inline-block w-px bg-border" />
          <Button variant="ghost" onClick={duplicate}>
            <Copy className="ms-2 h-4 w-4" />
            שכפל מערך
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Identification */}
          <FormSection
            title="פרטי המפגש"
            icon={<CalendarDays className="h-4 w-4" />}
            description="מידע בסיסי על המפגש והקשר שלו למקרה."
          >
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
                <Label htmlFor="title">כותרת המפגש *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="לדוגמה: המתנה לתור במשחק קבוצתי"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="age">גיל יעד</Label>
                <Input
                  id="age"
                  value={form.targetAge}
                  onChange={(e) => update("targetAge", e.target.value)}
                  placeholder="לדוגמה: 5–7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">משך זמן</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  placeholder="20 / 45 דקות"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill">מיומנות יעד</Label>
                <Input
                  id="skill"
                  value={form.targetSkill}
                  onChange={(e) => update("targetSkill", e.target.value)}
                  placeholder="לדוגמה: המתנה / בקשת עזרה"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">מטרת המפגש</Label>
              <Textarea
                id="goal"
                rows={2}
                value={form.sessionGoal}
                onChange={(e) => update("sessionGoal", e.target.value)}
                placeholder="ניסוח קצר של מטרת המפגש..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">חומרים</Label>
              <Textarea
                id="materials"
                rows={2}
                value={form.materials}
                onChange={(e) => update("materials", e.target.value)}
                placeholder="קלפים, טיימר, מדבקות, לוח שגרה..."
              />
            </div>
          </FormSection>

          {/* Structure */}
          <FormSection
            title="מבנה המפגש"
            icon={<Layers className="h-4 w-4" />}
            description="חלקי המפגש בסדר התרחשותם."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="opening">פתיחה</Label>
                <Textarea id="opening" rows={3} value={form.opening}
                  onChange={(e) => update("opening", e.target.value)}
                  placeholder="ברכה, קשר עין, הצגת לוח השגרה..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warmup">פעילות ויסות / חימום</Label>
                <Textarea id="warmup" rows={3} value={form.warmup}
                  onChange={(e) => update("warmup", e.target.value)}
                  placeholder="פעילות מרגיעה ומווסתת..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="main">פעילות מרכזית</Label>
                <Textarea id="main" rows={3} value={form.mainActivity}
                  onChange={(e) => update("mainActivity", e.target.value)}
                  placeholder="הפעילות סביב מיומנות היעד..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="practice">תרגול מודרך</Label>
                <Textarea id="practice" rows={3} value={form.guidedPractice}
                  onChange={(e) => update("guidedPractice", e.target.value)}
                  placeholder="דוגמה, חיקוי, תרגול עם סיוע מדורג..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="general">הכללה</Label>
                <Textarea id="general" rows={3} value={form.generalization}
                  onChange={(e) => update("generalization", e.target.value)}
                  placeholder="העברה להקשרים נוספים, אנשים שונים..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closing">סיכום</Label>
                <Textarea id="closing" rows={3} value={form.closing}
                  onChange={(e) => update("closing", e.target.value)}
                  placeholder="סיכום הצלחות, חיזוק, מעבר מסודר..." />
              </div>
            </div>
          </FormSection>

          {/* Mediation & support */}
          <FormSection
            title="תיווך, התאמות וחיזוקים"
            icon={<Sparkles className="h-4 w-4" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="med">משפטי תיווך</Label>
                <Textarea id="med" rows={3} value={form.mediationPhrases}
                  onChange={(e) => update("mediationPhrases", e.target.value)}
                  placeholder='לדוגמה: "אני רואה שאתה מתאמץ"...' />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adapt">התאמות לילד</Label>
                <Textarea id="adapt" rows={3} value={form.adaptations}
                  onChange={(e) => update("adaptations", e.target.value)}
                  placeholder="התאמות חושיות, סיוע ויזואלי, קצב..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reinf">תוכנית חיזוק</Label>
                <Textarea id="reinf" rows={3} value={form.reinforcementPlan}
                  onChange={(e) => update("reinforcementPlan", e.target.value)}
                  placeholder="מתי, איך ומה מחזקים..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="success">סימני הצלחה</Label>
                <Textarea id="success" rows={3} value={form.successSigns}
                  onChange={(e) => update("successSigns", e.target.value)}
                  placeholder="מה נחשיב כהצלחה במפגש..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diff">מה עושים אם מופיע קושי</Label>
              <Textarea id="diff" rows={3} value={form.ifDifficulty}
                onChange={(e) => update("ifDifficulty", e.target.value)}
                placeholder="פרוטוקול תגובה רגוע ומותאם..." />
            </div>
          </FormSection>

          {/* Output versions */}
          {(form.staffVersion || form.parentVersion) && (
            <div className="grid gap-6 md:grid-cols-2">
              {form.staffVersion && (
                <FormSection
                  title="גרסה לצוות"
                  icon={<Users className="h-4 w-4" />}
                  description="ניסוח יישומי לאנשי הצוות."
                >
                  <Textarea
                    rows={14}
                    value={form.staffVersion}
                    onChange={(e) => update("staffVersion", e.target.value)}
                    className="font-medium leading-relaxed"
                  />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(form.staffVersion, "גרסת הצוות")}>
                    <Copy className="ms-2 h-4 w-4" />
                    העתקה
                  </Button>
                </FormSection>
              )}
              {form.parentVersion && (
                <FormSection
                  title="גרסה להורים"
                  icon={<Heart className="h-4 w-4" />}
                  description="ניסוח חם ונגיש להורים."
                >
                  <Textarea
                    rows={14}
                    value={form.parentVersion}
                    onChange={(e) => update("parentVersion", e.target.value)}
                    className="font-medium leading-relaxed"
                  />
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(form.parentVersion, "גרסת ההורים")}>
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
            heading="מערכים שמורים"
            description={selectedCase ? `עבור: ${selectedCase.name}` : "בחרי מקרה"}
            items={caseSessions.map((s) => ({
              id: s.id,
              title: s.title,
              subtitle: s.targetSkill || s.sessionGoal,
              meta: `${s.duration || "ללא משך"} · עודכן ${formatDate(s.updatedAt)}`,
            }))}
            activeId={form.id}
            onSelect={loadFromList}
            onDelete={removeFromList}
            emptyText="עדיין אין מערכים שמורים למקרה זה."
          />
        </div>
      </div>
    </>
  );
};

export default Sessions;
