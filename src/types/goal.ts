export const GOAL_DOMAINS = [
  "התנהגותי",
  "חברתי",
  "רגשי",
  "תקשורתי",
  "למידה",
  "עצמאות",
  "תפקודים ניהוליים",
] as const;

export type GoalDomain = (typeof GOAL_DOMAINS)[number];

export interface Goal {
  id: string;
  caseId: string;
  domain: GoalDomain | "";
  targetBehavior: string;       // התנהגות / מיומנות יעד
  conditions: string;           // תנאים
  measure: string;              // מדד
  successCriterion: string;     // קריטריון הצלחה
  measurementFrequency: string; // תדירות מדידה
  responsible: string;          // אחראים
  professionalVersion: string;  // גרסה מקצועית (SMART)
  staffVersion: string;         // גרסה לצוות
  parentVersion: string;        // גרסה להורים
  createdAt: string;
  updatedAt: string;
}

export const createEmptyGoal = (caseId = ""): Goal => ({
  id: crypto.randomUUID(),
  caseId,
  domain: "",
  targetBehavior: "",
  conditions: "",
  measure: "",
  successCriterion: "",
  measurementFrequency: "",
  responsible: "",
  professionalVersion: "",
  staffVersion: "",
  parentVersion: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Builds three audience-tailored Hebrew SMART formulations from raw fields.
 */
export function buildSmartGoal(g: Goal): {
  professional: string;
  staff: string;
  parent: string;
} {
  const conditions = g.conditions.trim();
  const target = g.targetBehavior.trim();
  const measure = g.measure.trim();
  const criterion = g.successCriterion.trim();
  const frequency = g.measurementFrequency.trim();

  const conditionsPhrase = conditions ? conditions : "במצבים מובנים";
  const targetPhrase = target || "ההתנהגות/המיומנות שהוגדרה";
  const measurePhrase = measure ? ` באמצעות ${measure}` : "";
  const criterionPhrase = criterion ? `, ${criterion}` : "";
  const frequencyPhrase = frequency ? ` (מדידה: ${frequency})` : "";

  const professional =
    `${conditionsPhrase}, הילד/ה יבצע/תבצע את ${targetPhrase}${measurePhrase}${criterionPhrase}${frequencyPhrase}.`;

  const staff =
    `במהלך הפעילות, נעודד את הילד/ה ${target ? `ל${target}` : "להגיע למיומנות שהוגדרה"} ${
      conditions ? `במצבים של ${conditions}` : ""
    }. ${criterion ? `נחשיב הצלחה כאשר ${criterion}.` : ""} ${
      measure ? `נתעד באמצעות ${measure}` : ""
    }${frequency ? ` ${frequency}` : ""}. חשוב לשמר עקביות בין אנשי הצוות.`.replace(/\s+/g, " ").trim();

  const parent =
    `אנחנו עובדים יחד על ${target || "מיומנות חדשה"}${
      conditions ? `, בעיקר ב${conditions}` : ""
    }. נשמח אם תוכלו להזדמנויות דומות גם בבית, ולעודד את הילד/ה כשהוא/היא מצליח/ה. ${
      criterion ? `המטרה היא ש${criterion}.` : ""
    }`.replace(/\s+/g, " ").trim();

  return { professional, staff, parent };
}
