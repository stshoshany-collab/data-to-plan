import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TEMPLATES, TemplateCard } from "@/types/template";
import { Copy, FileStack } from "lucide-react";
import { toast } from "sonner";

const Templates = () => {
  const [selected, setSelected] = useState<TemplateCard | null>(null);
  const [editText, setEditText] = useState("");

  const open = (t: TemplateCard) => {
    setSelected(t);
    setEditText(t.content);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(editText);
      toast.success("התבנית הועתקה ללוח");
    } catch {
      toast.error("העתקה נכשלה");
    }
  };

  return (
    <div>
      <PageHeader
        title="תבניות מוכנות"
        description="תבניות מקצועיות לשימוש מהיר – לחצי על תבנית לפתיחה ועריכה."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Card
            key={t.id}
            className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow"
            onClick={() => open(t)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileStack className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{t.title}</CardTitle>
                </div>
                <Badge variant="secondary">{t.category}</Badge>
              </div>
              <CardDescription className="text-sm pt-1">{t.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">
                פתיחה ועריכה
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl" dir="rtl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={18}
                className="font-mono text-sm leading-relaxed"
                dir="rtl"
              />
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setEditText(selected.content)}>
                  איפוס לתבנית המקורית
                </Button>
                <Button onClick={copy}>
                  <Copy className="h-4 w-4" />
                  העתקה ללוח
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
