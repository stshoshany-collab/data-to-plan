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
import {
  Case,
  COMMUNICATION_LEVELS,
  FUNCTIONING_LEVELS,
  createEmptyCase,
} from "@/types/case";
import { Save } from "lucide-react";
import { PrivacyNotice } from "@/components/PrivacyNotice";

interface CaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCase?: Case | null;
  onSubmit: (c: Case) => void;
}

export function CaseFormDialog({
  open,
  onOpenChange,
  initialCase,
  onSubmit,
}: CaseFormDialogProps) {
  const [form, setForm] = useState<Case>(() => initialCase ?? createEmptyCase());

  useEffect(() => {
    if (open) {
      setForm(initialCase ?? createEmptyCase());
    }
  }, [open, initialCase]);

  const isEdit = Boolean(initialCase);

  const update = <K extends keyof Case>(key: K, value: Case[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader className="text-right">
          <DialogTitle>{isEdit ? "עריכת מקרה" : "מקרה חדש"}</DialogTitle>
          <DialogDescription>
            מלאי את הפרטים הבסיסיים של המקרה. ניתן לחזור ולערוך בכל עת.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isEdit && <PrivacyNotice />}
          {/* Identification */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="name">שם פרטי / קוד מזהה *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="לדוגמה: א׳"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">גיל</Label>
              <Input
                id="age"
                type="number"
                min={0}
                max={120}
                value={form.age ?? ""}
                onChange={(e) =>
                  update("age", e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder="לדוגמה: 6"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setting">מסגרת חינוכית</Label>
              <Input
                id="setting"
                value={form.educationalSetting}
                onChange={(e) => update("educationalSetting", e.target.value)}
                placeholder="לדוגמה: כיתה א׳"
              />
            </div>
          </section>

          {/* Levels */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>רמת תקשורת</Label>
              <Select
                value={form.communicationLevel || undefined}
                onValueChange={(v) => update("communicationLevel", v as Case["communicationLevel"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחרי רמה" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>רמת תפקוד</Label>
              <Select
                value={form.functioningLevel || undefined}
                onValueChange={(v) => update("functioningLevel", v as Case["functioningLevel"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחרי רמה" />
                </SelectTrigger>
                <SelectContent>
                  {FUNCTIONING_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <div className="space-y-2">
            <Label htmlFor="diagnoses">אבחנות / מאפיינים</Label>
            <Textarea
              id="diagnoses"
              rows={2}
              value={form.diagnoses}
              onChange={(e) => update("diagnoses", e.target.value)}
              placeholder="אבחנות פורמליות, מאפיינים בולטים..."
            />
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="strengths">תחומי חוזק</Label>
              <Textarea
                id="strengths"
                rows={3}
                value={form.strengths}
                onChange={(e) => update("strengths", e.target.value)}
                placeholder="לדוגמה: סקרנות, עניין בחיות..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulties">תחומי קושי</Label>
              <Textarea
                id="difficulties"
                rows={3}
                value={form.difficulties}
                onChange={(e) => update("difficulties", e.target.value)}
                placeholder="לדוגמה: כתיבה, המתנה..."
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="interests">תחומי עניין</Label>
              <Textarea
                id="interests"
                rows={2}
                value={form.interests}
                onChange={(e) => update("interests", e.target.value)}
                placeholder="חיות, ציור, מוזיקה..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reinforcers">מחזקים אפשריים</Label>
              <Textarea
                id="reinforcers"
                rows={2}
                value={form.reinforcers}
                onChange={(e) => update("reinforcers", e.target.value)}
                placeholder="מדבקות, בחירה בין שתי פעילויות..."
              />
            </div>
          </section>

          <div className="space-y-2">
            <Label htmlFor="sensitivities">רגישויות</Label>
            <Textarea
              id="sensitivities"
              rows={2}
              value={form.sensitivities}
              onChange={(e) => update("sensitivities", e.target.value)}
              placeholder="רגישויות חושיות, מצבים מעוררים..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">הערות מקצועיות</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.professionalNotes}
              onChange={(e) => update("professionalNotes", e.target.value)}
              placeholder="התרשמויות, נקודות לתשומת לב, הקשר משפחתי..."
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit">
              <Save className="ms-2 h-4 w-4" />
              {isEdit ? "שמירת שינויים" : "שמירת מקרה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
