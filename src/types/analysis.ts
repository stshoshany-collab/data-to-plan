export interface ABCAnalysis {
  id: string;
  caseId: string;
  situation: string;          // תיאור מצב
  antecedent: string;         // מה קרה לפני
  behavior: string;           // תיאור התנהגות אובייקטיבי
  consequence: string;        // מה קרה אחרי
  staffResponse: string;      // תגובת הצוות
  childResponse: string;      // תגובת הילד
  setEvents: string;          // משתנים מקדימים (Setting events)
  functionHypotheses: string; // השערות תפקוד אפשריות
  alternativeSkills: string;  // מיומנויות חלופיות אפשריות
  dataRecommendations: string; // המלצות להמשך איסוף נתונים
  summary: string;            // טקסט הסיכום שנוצר
  createdAt: string;
  updatedAt: string;
}

export const createEmptyAnalysis = (caseId = ""): ABCAnalysis => ({
  id: crypto.randomUUID(),
  caseId,
  situation: "",
  antecedent: "",
  behavior: "",
  consequence: "",
  staffResponse: "",
  childResponse: "",
  setEvents: "",
  functionHypotheses: "",
  alternativeSkills: "",
  dataRecommendations: "",
  summary: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Generates a non-judgmental, professional Hebrew narrative summary.
 * The text emphasizes that conclusions are working hypotheses, not final claims.
 */
export function buildAnalysisSummary(a: ABCAnalysis, caseName?: string): string {
  const subject = caseName ? `הילד/ה (${caseName})` : "הילד/ה";
  const lines: string[] = [];

  lines.push(`סיכום ניתוח מקרה – טיוטה מקצועית`);
  lines.push(
    `המסמך מציג ניתוח התנהגותי ראשוני המבוסס על מידע שנאסף עד כה. הממצאים מנוסחים כהשערות עבודה לצורך כיוון ההתערבות, ואינם מהווים קביעה אבחנתית או מסקנה סופית.`,
  );
  lines.push("");

  if (a.situation.trim()) {
    lines.push(`הקשר ומצב: ${a.situation.trim()}`);
  }

  if (a.setEvents.trim()) {
    lines.push(
      `משתנים מקדימים (Setting Events) שעשויים להשפיע על ההתנהגות: ${a.setEvents.trim()}.`,
    );
  }

  // Core ABC narrative
  const abcParts: string[] = [];
  if (a.antecedent.trim()) abcParts.push(`לפני ההתנהגות תועד: ${a.antecedent.trim()}`);
  if (a.behavior.trim()) abcParts.push(`ההתנהגות שנצפתה תוארה באופן אובייקטיבי: ${a.behavior.trim()}`);
  if (a.consequence.trim()) abcParts.push(`לאחר ההתנהגות התרחש: ${a.consequence.trim()}`);
  if (abcParts.length) {
    lines.push("");
    lines.push(`רצף אנטצדנט–התנהגות–תוצאה (ABC): ${abcParts.join("; ")}.`);
  }

  if (a.staffResponse.trim() || a.childResponse.trim()) {
    lines.push("");
    if (a.staffResponse.trim()) lines.push(`תגובת הצוות במצב: ${a.staffResponse.trim()}.`);
    if (a.childResponse.trim()) lines.push(`תגובת ${subject} בעקבות התגובה: ${a.childResponse.trim()}.`);
  }

  if (a.functionHypotheses.trim()) {
    lines.push("");
    lines.push(
      `על בסיס המידע שנאסף, מועלות ההשערות הבאות לגבי תפקוד ההתנהגות, מבלי לקבוע קביעה חד־משמעית: ${a.functionHypotheses.trim()}. יש לאשש או להפריך השערות אלו באמצעות תצפיות נוספות.`,
    );
  }

  if (a.alternativeSkills.trim()) {
    lines.push("");
    lines.push(
      `מיומנויות חלופיות אפשריות שניתן לקדם, באופן המכבד את הילד/ה ואת הצרכים העומדים בבסיס ההתנהגות: ${a.alternativeSkills.trim()}.`,
    );
  }

  if (a.dataRecommendations.trim()) {
    lines.push("");
    lines.push(`המלצות להמשך איסוף נתונים: ${a.dataRecommendations.trim()}.`);
  }

  lines.push("");
  lines.push(
    `הערה מקצועית: כל הניסוחים בסיכום זה הם השערות עבודה. מומלץ להמשיך באיסוף שיטתי של נתונים, לעדכן את ההשערות בהתאם, ולקבל החלטות התערבות בתהליך משותף עם הצוות וההורים.`,
  );

  return lines.join("\n");
}
