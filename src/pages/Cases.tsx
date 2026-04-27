import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Case, demoCases } from "@/types/case";
import { CaseFormDialog } from "@/components/cases/CaseFormDialog";
import { toast } from "sonner";
import { logAudit } from "@/lib/auditLog";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
  FolderOpen,
  Calendar,
  GraduationCap,
  Inbox,
} from "lucide-react";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const Cases = () => {
  const { cases, addCase, updateCase, deleteCase, duplicateCase } = useCases();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Case | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Case | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) =>
      [
        c.name,
        c.educationalSetting,
        c.diagnoses,
        c.strengths,
        c.difficulties,
        c.interests,
        c.professionalNotes,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q)),
    );
  }, [cases, search]);

  const handleNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (c: Case) => {
    setEditing(c);
    setFormOpen(true);
  };

  const handleSubmit = (c: Case) => {
    if (editing) {
      updateCase(c.id, c);
      void logAudit("update", "case", c.id, { name: c.name });
      toast.success("נשמר בהצלחה", { description: `המקרה "${c.name}" עודכן.` });
    } else {
      addCase(c);
      void logAudit("create", "case", c.id, { name: c.name });
      toast.success("נשמר בהצלחה", { description: `המקרה "${c.name}" נוסף.` });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleDuplicate = (c: Case) => {
    duplicateCase(c.id);
    void logAudit("create", "case", null, { duplicatedFrom: c.id, name: c.name });
    toast.success("המקרה שוכפל", { description: `נוצר עותק של "${c.name}".` });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const name = pendingDelete.name;
    const id = pendingDelete.id;
    deleteCase(id);
    void logAudit("delete", "case", id, { name });
    setPendingDelete(null);
    toast.success("המקרה נמחק", { description: `"${name}" הוסר מהרשימה.` });
  };

  return (
    <>
      <PageHeader
        title="מקרים"
        description={`סך הכל ${cases.length} מקרים במערכת`}
        actions={
          <Button onClick={handleNew}>
            <Plus className="ms-2 h-4 w-4" />
            מקרה חדש
          </Button>
        }
      />

      {/* Search bar */}
      <Card className="shadow-card mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם, מסגרת, אבחנה, תחום עניין..."
              className="pr-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="shadow-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary mb-4">
              <Inbox className="h-7 w-7" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              {cases.length === 0 ? "אין עדיין מקרים במערכת" : "לא נמצאו תוצאות לחיפוש"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              {cases.length === 0
                ? "התחילי בהוספת מקרה ראשון על מנת לנהל מידע, מטרות ותוכניות התערבות."
                : "נסי לחפש במונחים אחרים או נקי את שדה החיפוש."}
            </p>
            {cases.length === 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button onClick={handleNew}>
                  <Plus className="ms-2 h-4 w-4" />
                  הוספת מקרה ראשון
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    for (const c of demoCases) {
                      addCase({
                        ...c,
                        id: crypto.randomUUID(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      });
                    }
                    toast.success("נטענו נתוני דוגמה");
                  }}
                >
                  טען נתוני דוגמה
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="shadow-card hover:shadow-elegant transition-shadow flex flex-col"
            >
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{c.name || "ללא שם"}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        {c.age != null && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            גיל {c.age}
                          </span>
                        )}
                        {c.educationalSetting && (
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {c.educationalSetting}
                          </span>
                        )}
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
                      <DropdownMenuItem onClick={() => handleEdit(c)}>
                        <Pencil className="ms-2 h-4 w-4" />
                        עריכה
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(c)}>
                        <Copy className="ms-2 h-4 w-4" />
                        שכפול
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setPendingDelete(c)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="ms-2 h-4 w-4" />
                        מחיקה
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.communicationLevel && (
                    <Badge variant="secondary" className="font-normal">
                      תקשורת: {c.communicationLevel}
                    </Badge>
                  )}
                  {c.functioningLevel && (
                    <Badge variant="secondary" className="font-normal">
                      תפקוד: {c.functioningLevel}
                    </Badge>
                  )}
                </div>

                {c.strengths && (
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-medium text-foreground">חוזקות: </span>
                    <span className="line-clamp-2">{c.strengths}</span>
                  </p>
                )}
                {c.difficulties && (
                  <p className="text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-foreground">קשיים: </span>
                    <span className="line-clamp-2">{c.difficulties}</span>
                  </p>
                )}

                <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>עודכן: {formatDate(c.updatedAt)}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
                    פתיחה
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <CaseFormDialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
        initialCase={editing}
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle>למחוק את המקרה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תסיר את "{pendingDelete?.name}" מהמערכת ולא ניתן לבטלה.
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

export default Cases;
