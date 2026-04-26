import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal, GOAL_DOMAINS, buildSmartGoal, createEmptyGoal } from "@/types/goal";
import { Case } from "@/types/case";
import { Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal?: Goal | null;
  defaultCaseId?: string;
  cases: Case[];
  onSubmit: (g: Goal) => void;
}

export function GoalFormDialog({
  open,
  onOpenChange,
  initialGoal,
  defaultCaseId,
  cases,
  onSubmit,
}: GoalFormDialogProps) {
  const [form, setForm] = useState<Goal>(
    () => initialGoal ?? createEmptyGoal(defaultCaseId),
  );

  useEffect(() => {
    if (open) {
      setForm(initialGoal ?? createEmptyGoal(defaultCaseId));
    }
  }, [open, initialGoal, defaultCaseId]);

  const isEdit = Boolean(initialGoal);

  const update = <K extends keyof Goal>(key: K, value: Goal[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleGenerateSmart = () => {
    if (!form.targetBehavior.trim()) {
      toast.error("יש להזין התנהגות / מיומנות יעד לפני יצירת SMART.");
      return;
    }
    const versions = buildSmartGoal(form);
    setForm((p) => ({
      ...p,
      professionalVersion: versions.professional,
      staffVersion: versions.staff,
      parentVersion: versions.parent,
    }));
    toast.success("נוצרו 3 גרסאות מטרה.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.caseId) {
      toast.error("יש לשייך את המטרה למקרה.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader className="text-right">
          <DialogTitle>{isEdit ? "עריכת מטרה" : "מטרה חדשה"}</DialogTitle>
          <DialogDescription>
            הגדירי את רכיבי המטרה. ניתן ליצור אוטומטית 3 גרסאות (מקצועית, צוות, הורים).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>שיוך למקרה *</Label>
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
              <Label>תחום</Label>
              <Select
                value={form.domain || undefined}
                onValueChange={(v) => update("domain", v as Goal["domain"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחרי תחום" />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <div className="space-y-2">
            <Label htmlFor="target">התנהגות / מיומנות יעד *</Label>
            <Textarea
              id="target"
              rows={2}
              required
              value={form.targetBehavior}
              onChange={(e) => update("targetBehavior", e.target.value)}
              placeholder='לדוגמה: להמתין לתורו ע"י ישיבה במקום והמתנה'
            />
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="conditions">תנאים</Label>
              <Textarea
                id="conditions"
                rows={2}
                value={form.conditions}
                onChange={(e) => update("conditions", e.target.value)}
                placeholder="במהלך פעילות מונחית בקבוצה קטנה..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="measure">מדד</Label>
              <Textarea
                id="measure"
                rows={2}
                value={form.measure}
                onChange={(e) => update("measure", e.target.value)}
                placeholder="ספירת תדירות, אחוז הזדמנויות, משך זמן..."
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="criterion">קריטריון הצלחה</Label>
              <Textarea
                id="criterion"
                rows={2}
                value={form.successCriterion}
                onChange={(e) => update("successCriterion", e.target.value)}
                placeholder="ב-4 מתוך 5 הזדמנויות, לאורך שני שבועות רצופים"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">תדירות מדידה</Label>
              <Input
                id="frequency"
                value={form.measurementFrequency}
                onChange={(e) => update("measurementFrequency", e.target.value)}
                placeholder="פעמיים בשבוע / בכל מפגש"
              />
            </div>
          </section>

          <div className="space-y-2">
            <Label htmlFor="responsible">אחראים</Label>
            <Input
              id="responsible"
              value={form.responsible}
              onChange={(e) => update("responsible", e.target.value)}
              placeholder="גננת, סייעת, מנתחת התנהגות, הורים..."
            />
          </div>

          <div className="rounded-lg border border-dashed p-4 bg-gradient-soft space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-0.5">
                <p className="font-medium text-sm">יצירת ניסוחי SMART אוטומטיים</p>
                <p className="text-xs text-muted-foreground">
                  ייצור גרסה מקצועית, גרסה לצוות וגרסה להורים על בסיס השדות שמולאו.
                </p>
              </div>
              <Button type="button" onClick={handleGenerateSmart} variant="default">
                <Sparkles className="ms-2 h-4 w-4" />
                צור מטרת SMART
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prof">גרסה מקצועית</Label>
            <Textarea
              id="prof"
              rows={3}
              value={form.professionalVersion}
              onChange={(e) => update("professionalVersion", e.target.value)}
              placeholder="ניסוח מלא ומדויק עם תנאים, מדד וקריטריון..."
            />
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="staff">גרסה לצוות</Label>
              <Textarea
                id="staff"
                rows={3}
                value={form.staffVersion}
                onChange={(e) => update("staffVersion", e.target.value)}
                placeholder="הסבר מעשי ליישום שגרתי..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent">גרסה להורים</Label>
              <Textarea
                id="parent"
                rows={3}
                value={form.parentVersion}
                onChange={(e) => update("parentVersion", e.target.value)}
                placeholder="ניסוח חם ונגיש להורים..."
              />
            </div>
          </section>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit">
              <Save className="ms-2 h-4 w-4" />
              {isEdit ? "שמירת שינויים" : "שמירת מטרה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
