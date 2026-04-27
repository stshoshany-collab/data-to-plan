import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PrivacyNoticeProps {
  className?: string;
  variant?: "default" | "compact";
}

/**
 * Privacy reminder shown before creating a new case or uploading a file.
 * Hebrew, RTL, non-blocking.
 */
export function PrivacyNotice({ className, variant = "default" }: PrivacyNoticeProps) {
  if (variant === "compact") {
    return (
      <p className={`text-xs text-muted-foreground flex items-start gap-2 ${className ?? ""}`}>
        <ShieldAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          מומלץ להשתמש בקוד מקרה ולא בשם מלא, ולהימנע מהזנת מידע מזהה שאינו הכרחי.
        </span>
      </p>
    );
  }

  return (
    <Alert className={className}>
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>הודעת פרטיות</AlertTitle>
      <AlertDescription>
        המערכת מיועדת לעבודה מקצועית. מומלץ להשתמש בקוד מקרה ולא בשם מלא של ילד,
        ולהימנע מהזנת מידע מזהה שאינו הכרחי.
      </AlertDescription>
    </Alert>
  );
}
