export const REPORT_TYPES = [
  "סיכום מפגש",
  "סיכום הדרכת הורים",
  "סיכום צוות",
  "דוח תצפית",
  "דוח התקדמות",
  "תיעוד אירוע חריג",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];

export interface Report {
  id: string;
  date: string; // ISO date
  caseId: string;
  type: ReportType;
  participants: string;
  goals: string;
  whatWasDone: string;
  childResponse: string;
  results: string;
  conclusions: string;
  recommendations: string;
  generatedText: string;
  createdAt: string;
  updatedAt: string;
}

export const createEmptyReport = (): Report => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  caseId: "",
  type: "סיכום מפגש",
  participants: "",
  goals: "",
  whatWasDone: "",
  childResponse: "",
  results: "",
  conclusions: "",
  recommendations: "",
  generatedText: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

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

export function buildReport(
  r: Report,
  caseName: string,
): string {
  const lines: string[] = [];
  lines.push(`${r.type}`);
  lines.push(`תאריך: ${formatDate(r.date)}`);
  if (caseName) lines.push(`מקרה: ${caseName}`);
  if (r.participants) lines.push(`נוכחים: ${r.participants}`);
  lines.push("");

  if (r.goals.trim()) {
    lines.push("מטרות הפגישה:");
    lines.push(r.goals.trim());
    lines.push("");
  }

  if (r.whatWasDone.trim()) {
    lines.push("מהלך הפגישה / מה נעשה:");
    lines.push(r.whatWasDone.trim());
    lines.push("");
  }

  if (r.childResponse.trim()) {
    lines.push("תגובת הילד/ה:");
    lines.push(r.childResponse.trim());
    lines.push("");
  }

  if (r.results.trim()) {
    lines.push("תוצאות ותצפיות:");
    lines.push(r.results.trim());
    lines.push("");
  }

  if (r.conclusions.trim()) {
    lines.push("מסקנות מקצועיות:");
    lines.push(r.conclusions.trim());
    lines.push("");
  }

  if (r.recommendations.trim()) {
    lines.push("המלצות להמשך:");
    lines.push(r.recommendations.trim());
    lines.push("");
  }

  // Type-specific closing
  switch (r.type) {
    case "תיעוד אירוע חריג":
      lines.push(
        "הערה: התיעוד מתאר את האירוע באופן עובדתי, ללא פרשנות שיפוטית, לטובת המשך עבודה והערכה מקצועית.",
      );
      break;
    case "דוח תצפית":
      lines.push(
        "הערה: התצפית בוצעה במסגרת הטבעית של הילד/ה ומשמשת בסיס לגיבוש השערות עבודה והמשך איסוף נתונים.",
      );
      break;
    case "דוח התקדמות":
      lines.push(
        "הערה: דוח זה מסכם את ההתקדמות בתקופה המדווחת ומשמש בסיס לעדכון המטרות ותוכנית ההתערבות.",
      );
      break;
    default:
      lines.push("נכתב בלשון מקצועית, לא שיפוטית, לטובת תיעוד והמשך עבודה.");
  }

  return lines.join("\n");
}
