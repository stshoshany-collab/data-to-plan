import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";

export interface SidebarListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
}

interface RecordsSidebarProps {
  heading: string;
  description?: string;
  items: SidebarListItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  emptyText: string;
  actions?: ReactNode;
}

export function RecordsSidebar({
  heading,
  description,
  items,
  activeId,
  onSelect,
  onDelete,
  emptyText,
  actions,
}: RecordsSidebarProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{heading}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{emptyText}</p>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(it.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(it.id);
                }
              }}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                it.id === activeId
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-medium text-sm leading-snug line-clamp-2 flex-1">
                  {it.title || "ללא כותרת"}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 -mt-1 -ms-2 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(it.id);
                  }}
                  aria-label="מחיקה"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {it.subtitle && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                  {it.subtitle}
                </p>
              )}
              {it.meta && (
                <Badge variant="secondary" className="font-normal text-xs">
                  {it.meta}
                </Badge>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
