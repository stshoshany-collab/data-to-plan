export interface InterventionPlan {
  id: string;
  caseId: string;
  planName: string;            // שם התוכנית
  targetBehavior: string;      // התנהגות מטרה
  objectiveDefinition: string; // הגדרה אובייקטיבית
  functionHypotheses: string;  // השערות תפקוד
  preventionStrategies: string; // אסטרטגיות מניעה
  directInstruction: string;   // הוראה ישירה של מיומנויות חלופיות
  alternativeSkills: string;   // מיומנויות חלופיות
  reinforcers: string;         // חיזוקים
  staffResponse: string;       // תגובת צוות מומלצת
  measurement: string;         // מדידה
  generalization: string;      // הכללה
  staffGuidelines: string;     // הנחיות לצוות
  parentGuidelines: string;    // הנחיות להורים
  fullPlan: string;            // טקסט תוכנית מלאה
  staffShort: string;          // גרסה מקוצרת לצוות
  parentShort: string;         // גרסה להורים
  createdAt: string;
  updatedAt: string;
}

export const createEmptyIntervention = (caseId = ""): InterventionPlan => ({
  id: crypto.randomUUID(),
  caseId,
  planName: "",
  targetBehavior: "",
  objectiveDefinition: "",
  functionHypotheses: "",
  preventionStrategies: "",
  directInstruction: "",
  alternativeSkills: "",
  reinforcers: "",
  staffResponse: "",
  measurement: "",
  generalization: "",
  staffGuidelines: "",
  parentGuidelines: "",
  fullPlan: "",
  staffShort: "",
  parentShort: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const sectionIfPresent = (label: string, value: string) =>
  value.trim() ? `${label}: ${value.trim()}.` : "";

export function buildFullPlan(p: InterventionPlan): string {
  const lines: string[] = [];
  lines.push(`תוכנית התערבות מקצועית${p.planName ? ` – ${p.planName}` : ""}`);
  lines.push(
    "מסמך זה מציג תוכנית התערבות מובנית המבוססת על המידע שנאסף עד כה. כל ההמלצות ניתנות באופן מכבד, לא שיפוטי, ומתוך הבנה של הצרכים העומדים בבסיס ההתנהגות.",
  );
  lines.push("");
  lines.push("הגדרת ההתנהגות:");
  if (p.targetBehavior.trim()) lines.push(`• התנהגות מטרה: ${p.targetBehavior.trim()}.`);
  if (p.objectiveDefinition.trim())
    lines.push(`• הגדרה אובייקטיבית: ${p.objectiveDefinition.trim()}.`);
  if (p.functionHypotheses.trim()) {
    lines.push("");
    lines.push(
      `השערות תפקוד עבודה (לאישוש בהמשך): ${p.functionHypotheses.trim()}.`,
    );
  }
  lines.push("");
  lines.push("רכיבי ההתערבות:");
  const comp = [
    sectionIfPresent("• אסטרטגיות מניעה (Antecedent)", p.preventionStrategies),
    sectionIfPresent("• הוראה ישירה של מיומנויות חלופיות", p.directInstruction),
    sectionIfPresent("• מיומנויות חלופיות שיוקנו", p.alternativeSkills),
    sectionIfPresent("• חיזוקים מתוכננים", p.reinforcers),
    sectionIfPresent("• תגובת צוות מומלצת", p.staffResponse),
  ].filter(Boolean);
  lines.push(...comp);

  lines.push("");
  lines.push("מדידה והכללה:");
  if (p.measurement.trim()) lines.push(`• מדידה: ${p.measurement.trim()}.`);
  if (p.generalization.trim()) lines.push(`• הכללה: ${p.generalization.trim()}.`);

  if (p.staffGuidelines.trim() || p.parentGuidelines.trim()) {
    lines.push("");
    lines.push("הנחיות יישום:");
    if (p.staffGuidelines.trim()) lines.push(`• לצוות: ${p.staffGuidelines.trim()}.`);
    if (p.parentGuidelines.trim()) lines.push(`• להורים: ${p.parentGuidelines.trim()}.`);
  }

  lines.push("");
  lines.push(
    "הערה מקצועית: התוכנית גמישה ומבוססת על מידע מתעדכן. יש לשמר עקביות בין אנשי הצוות, לתעד את היישום באופן שיטתי, ולעדכן את הרכיבים בהתאם לנתונים שיצטברו.",
  );
  return lines.join("\n");
}

export function buildStaffShort(p: InterventionPlan): string {
  const lines: string[] = [];
  lines.push(`תוכנית התערבות – גרסה מקוצרת לצוות${p.planName ? ` (${p.planName})` : ""}`);
  if (p.targetBehavior.trim())
    lines.push(`התנהגות שאליה אנו מתייחסים: ${p.targetBehavior.trim()}.`);
  if (p.functionHypotheses.trim())
    lines.push(`למה זה קורה (השערה): ${p.functionHypotheses.trim()}.`);
  lines.push("");
  lines.push("מה עושים בפועל:");
  if (p.preventionStrategies.trim())
    lines.push(`• מניעה: ${p.preventionStrategies.trim()}.`);
  if (p.alternativeSkills.trim())
    lines.push(`• מלמדים במקום: ${p.alternativeSkills.trim()}.`);
  if (p.staffResponse.trim())
    lines.push(`• כשההתנהגות מופיעה: ${p.staffResponse.trim()}.`);
  if (p.reinforcers.trim()) lines.push(`• מחזקים: ${p.reinforcers.trim()}.`);
  if (p.measurement.trim()) lines.push(`• מתעדים: ${p.measurement.trim()}.`);
  if (p.staffGuidelines.trim()) {
    lines.push("");
    lines.push(`דגשים: ${p.staffGuidelines.trim()}.`);
  }
  lines.push("");
  lines.push("חשוב: להישאר ברגיעה, לתת מענה אחיד, ולפנות למנתחת ההתנהגות בכל שאלה.");
  return lines.join("\n");
}

export function buildParentShort(p: InterventionPlan): string {
  const lines: string[] = [];
  lines.push(`תוכנית התערבות – גרסה להורים${p.planName ? ` (${p.planName})` : ""}`);
  lines.push(
    "אנחנו רוצים לשתף אתכם בכיוון המקצועי שבחרנו, באופן ברור ונגיש. המטרה היא לתמוך בילדכם בצורה רגועה ועקבית.",
  );
  lines.push("");
  if (p.targetBehavior.trim())
    lines.push(`על מה אנחנו עובדים: ${p.targetBehavior.trim()}.`);
  if (p.functionHypotheses.trim())
    lines.push(
      `מה אנחנו מבינים על הצורך שמאחורי ההתנהגות: ${p.functionHypotheses.trim()}.`,
    );
  if (p.alternativeSkills.trim())
    lines.push(`מה אנחנו מלמדים במקום: ${p.alternativeSkills.trim()}.`);
  if (p.reinforcers.trim())
    lines.push(`איך מעודדים ומחזקים הצלחות: ${p.reinforcers.trim()}.`);
  if (p.parentGuidelines.trim()) {
    lines.push("");
    lines.push(`איך אפשר לתמוך גם בבית: ${p.parentGuidelines.trim()}.`);
  }
  lines.push("");
  lines.push(
    "אנחנו כאן בשבילכם. כל שינוי לוקח זמן, ואנחנו מאמינים שעבודה משותפת רגישה ועקבית מובילה לתוצאות. נשמח לעדכון משותף בכל שלב.",
  );
  return lines.join("\n");
}
