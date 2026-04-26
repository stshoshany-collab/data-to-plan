import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useCases } from "@/hooks/useCases";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Goal } from "@/types/goal";
import { GoalFormDialog } from "@/components/goals/GoalFormDialog";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  Target,
  Inbox,
  User,
} from "lucide-react";

const STORAGE_KEY = "ba-app:goals:v1";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const Goals = () => {
  const { cases } = useCases();
  const [goals, setGoals] = useLocalStorageState<Goal[]>(STORAGE_KEY, []);
  const [search, setSearch] = useState("");
  const [filterCase, setFilterCase] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Goal | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return goals.filter((g) => {
      if (filterCase !== "all" && g.caseId !== filterCase) return false;
      if (!q) return true;
      return [
        g.targetBehavior,
        g.conditions,
        g.measure,
        g.successCriterion,
        g.responsible,
        g.professionalVersion,
        g.staffVersion,
        g.parentVersion,
        g.domain,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [goals, search, filterCase]);

  const caseName = (id: string) =>
    cases.find((c) => c.id === id)?.name || "מקרה לא ידוע";

  const handleNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (g: Goal) => {
    setEditing(g);
    setFormOpen(true);
  };

  const handleSubmit = (g: Goal) => {
    const now = new Date().toISOString();
    setGoals((prev) => {
      const exists = prev.some((x) => x.id === g.id);
      if (exists) {
        return prev.map((x) =>
          x.id === g.id ? { ...g, updatedAt: now } : x,
        );
      }
      return [{ ...g, createdAt: now, updatedAt: now }, ...prev];
    });
    toast.success("נשמר בהצלחה", {
      description: editing ? "המטרה עודכנה." : "המטרה נוספה.",
    });
    setFormOpen(false);
    setEditing(null);
  };

  const handleDuplicate = (g: Goal) => {
    const copy: Goal = {
      ...g,
      id: crypto.randomUUID(),
      targetBehavior: `${g.targetBehavior} (עותק)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setGoals((prev) => [copy, ...prev]);
    toast.success("המטרה שוכפלה");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setGoals((prev) => prev.filter((x) => x.id !== pendingDelete.id));
    setPendingDelete(null);
    toast.success("המטרה נמחקה");
  };

  return (
    <>
      <PageHeader
        title="מטרות"
        description={`סך הכל ${goals.length} מטרות במערכת`}
        actions={
          <Button onClick={handleNew} disabled={cases.length === 0}>
            <Plus className="ms-2 h-4 w-4" />
            מטרה חדשה
          </Button>
        }
      />

      {cases.length === 0 && (
        <Card className="shadow-card border-dashed mb-6 bg-warning/5">
          <CardContent className="p-4 text-sm">
            אין עדיין מקרים במערכת. כדי להגדיר מטרות, יש להוסיף קודם מקרה במסך "מקרים".
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card mb-6">
        <CardContent className="p-4 grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש בתוכן המטרה..."
              className="pr-9"
            />
          </div>
          <Select value={filterCase} onValueChange={setFilterCase}>
            <SelectTrigger>
              <SelectValue placeholder="סינון לפי מקרה" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המקרים</SelectItem>
              {cases.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name || "ללא שם"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="shadow-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary mb-4">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {goals.length === 0 ? "אין עדיין מטרות במערכת" : "לא נמצאו תוצאות"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {goals.length === 0
                ? "ניתן להגדיר מטרת SMART ראשונה ולקשר אותה למקרה קיים."
                : "נסי חיפוש אחר או נקי את הפילטרים."}
            </p>
            {goals.length === 0 && cases.length > 0 && (
              <Button onClick={handleNew}>
                <Plus className="ms-2 h-4 w-4" />
                מטרה ראשונה
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((g) => (
            <Card
              key={g.id}
              className="shadow-card hover:shadow-elegant transition-shadow flex flex-col"
            >
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <Target className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-snug">
                        {g.targetBehavior || "מטרה ללא כותרת"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {caseName(g.caseId)}
                        </span>
                        <span>עודכן: {formatDate(g.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="shrink-0 -mt-1 -ms-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleEdit(g)}>
                        <Pencil className="ms-2 h-4 w-4" />
                        עריכה
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(g)}>
                        <Copy className="ms-2 h-4 w-4" />
                        שכפול
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setPendingDelete(g)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="ms-2 h-4 w-4" />
                        מחיקה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {g.domain && (
                    <Badge variant="secondary" className="font-normal">
                      תחום: {g.domain}
                    </Badge>
                  )}
                  {g.measurementFrequency && (
                    <Badge variant="secondary" className="font-normal">
                      מדידה: {g.measurementFrequency}
                    </Badge>
                  )}
                </div>

                {g.professionalVersion && (
                  <div className="rounded-lg bg-muted/40 p-3 text-xs leading-relaxed mb-2 border border-border">
                    <p className="font-medium text-foreground mb-1">גרסה מקצועית:</p>
                    <p className="text-muted-foreground line-clamp-4">
                      {g.professionalVersion}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-auto">
                  {g.successCriterion && (
                    <div>
                      <p className="font-medium text-foreground">קריטריון</p>
                      <p className="line-clamp-2">{g.successCriterion}</p>
                    </div>
                  )}
                  {g.responsible && (
                    <div>
                      <p className="font-medium text-foreground">אחראים</p>
                      <p className="line-clamp-2">{g.responsible}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GoalFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initialGoal={editing}
        defaultCaseId={filterCase !== "all" ? filterCase : cases[0]?.id}
        cases={cases}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle>למחוק את המטרה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תסיר את המטרה מהמערכת ולא ניתן לבטלה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              מחיקה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Goals;
