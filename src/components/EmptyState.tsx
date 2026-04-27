import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * Calm, RTL Hebrew empty state. Used across all list/detail screens
 * to give users a clear next step instead of a blank page.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <Card className={`shadow-card border-dashed bg-gradient-soft ${className ?? ""}`}>
      <CardContent className="py-10 text-center flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon ?? <Inbox className="h-6 w-6" />}
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="pt-1">{action}</div>}
      </CardContent>
    </Card>
  );
}
