export interface SessionPlan {
  id: string;
  caseId: string;
  title: string;             // כותרת המפגש
  targetAge: string;         // גיל יעד
  duration: string;          // משך זמן (טקסט: 20 דק' / 45 דק' / מותאם)
  targetSkill: string;       // מיומנות יעד
  sessionGoal: string;       // מטרת המפגש
  materials: string;         // חומרים
  opening: string;           // פתיחה
  warmup: string;            // פעילות ויסות / חימום
  mainActivity: string;      // פעילות מרכזית
  guidedPractice: string;    // תרגול מודרך
  generalization: string;    // הכללה
  closing: string;           // סיכום
  mediationPhrases: string;  // משפטי תיווך
  adaptations: string;       // התאמות לילד
  reinforcementPlan: string; // תוכנית חיזוק
  successSigns: string;      // סימני הצלחה
  ifDifficulty: string;      // מה עושים אם מופיע קושי
  staffVersion: string;      // גרסה לצוות
  parentVersion: string;     // גרסה להורים
  createdAt: string;
  updatedAt: string;
}

export const createEmptySession = (caseId = ""): SessionPlan => ({
  id: crypto.randomUUID(),
  caseId,
  title: "",
  targetAge: "",
  duration: "",
  targetSkill: "",
  sessionGoal: "",
  materials: "",
  opening: "",
  warmup: "",
  mainActivity: "",
  guidedPractice: "",
  generalization: "",
  closing: "",
  mediationPhrases: "",
  adaptations: "",
  reinforcementPlan: "",
  successSigns: "",
  ifDifficulty: "",
  staffVersion: "",
  parentVersion: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Returns sensible defaults for a 20-min or 45-min session structure.
 * Existing user content is preserved – only empty fields are filled.
 */
export function applySessionTemplate(
  s: SessionPlan,
  variant: "20" | "45",
): SessionPlan {
  const t20 = {
    duration: "20 דקות",
    opening:
      "ברכת שלום אישית, יצירת קשר עין, הצגת לוח השגרה של המפגש (כ-2 דק').",
    warmup:
      "פעילות חימום קצרה ומוכרת לוויסות חושי – שיר תנועה, נשימה משותפת או משחק חזרה (כ-3 דק').",
    mainActivity:
      "פעילות מרכזית קצרה וממוקדת סביב מיומנות היעד, בהקשר משחקי ומונחה (כ-8 דק').",
    guidedPractice:
      "תרגול מודרך קצר עם דוגמה–חקיינות–תרגול עצמאי, סיוע מדורג והדרגתי (כ-4 דק').",
    generalization:
      "הזדמנות אחת או שתיים ליישום בהקשר מעט שונה, להעברה ראשונית (כ-2 דק').",
    closing:
      "סיכום קצר של ההצלחות, חיזוק, סימון בלוח השגרה ופרידה (כ-1 דק').",
  };
  const t45 = {
    duration: "45 דקות",
    opening:
      "פתיחה מובנית – ברכה, שיחה קצרה על השגרה, הצגת לוח המפגש ובחירה של פעילות מועדפת (כ-5 דק').",
    warmup:
      "פעילות ויסות וחימום: תנועה, מוזיקה, מגע מותאם או משחק חברתי קצר (כ-7 דק').",
    mainActivity:
      "פעילות מרכזית ממושכת סביב מיומנות היעד, בשילוב עניין הילד וחומרים מגוונים (כ-15 דק').",
    guidedPractice:
      "תרגול מודרך עם דוגמה, חיקוי, ותרגול עם משוב חיובי וספציפי. סיוע מדורג ודעיכת סיוע הדרגתית (כ-10 דק').",
    generalization:
      "הזדמנויות הכללה במספר הקשרים: שינוי חומרים, שינוי שותף, או שינוי מיקום (כ-5 דק').",
    closing:
      "סיכום משותף של מה שלמדנו, חיזוק חיובי, מעבר מסודר וחיבור לפעילות הבאה (כ-3 דק').",
  };
  const tmpl = variant === "20" ? t20 : t45;
  return {
    ...s,
    duration: s.duration || tmpl.duration,
    opening: s.opening || tmpl.opening,
    warmup: s.warmup || tmpl.warmup,
    mainActivity: s.mainActivity || tmpl.mainActivity,
    guidedPractice: s.guidedPractice || tmpl.guidedPractice,
    generalization: s.generalization || tmpl.generalization,
    closing: s.closing || tmpl.closing,
    mediationPhrases:
      s.mediationPhrases ||
      'דוגמאות: "אני רואה שאתה מתאמץ", "בוא ננסה ביחד", "מה אתה מרגיש עכשיו?", "אפשר להגיד: אני צריך הפסקה".',
    successSigns:
      s.successSigns ||
      "השתתפות פעילה, יצירת קשר עין, ניסיונות עצמאיים, שימוש בשפה מתווכת, ויסות לאחר רגעי קושי.",
    ifDifficulty:
      s.ifDifficulty ||
      "להפחית דרישה, להציע בחירה בין שתי אפשרויות, לעבור לפעילות מוכרת ומווסתת, לשמר טון רגוע ולתעד את האירוע.",
  };
}

export function buildSessionStaffVersion(s: SessionPlan): string {
  const lines: string[] = [];
  lines.push(`מערך מפגש – גרסה לצוות`);
  if (s.title) lines.push(`כותרת: ${s.title}`);
  if (s.duration) lines.push(`משך: ${s.duration}`);
  if (s.targetSkill) lines.push(`מיומנות יעד: ${s.targetSkill}`);
  if (s.sessionGoal) lines.push(`מטרת המפגש: ${s.sessionGoal}`);
  lines.push("");
  lines.push("מבנה המפגש (לפי הסדר):");
  if (s.opening) lines.push(`• פתיחה: ${s.opening}`);
  if (s.warmup) lines.push(`• ויסות / חימום: ${s.warmup}`);
  if (s.mainActivity) lines.push(`• פעילות מרכזית: ${s.mainActivity}`);
  if (s.guidedPractice) lines.push(`• תרגול מודרך: ${s.guidedPractice}`);
  if (s.generalization) lines.push(`• הכללה: ${s.generalization}`);
  if (s.closing) lines.push(`• סיכום: ${s.closing}`);
  lines.push("");
  if (s.materials) lines.push(`חומרים נדרשים: ${s.materials}.`);
  if (s.adaptations) lines.push(`התאמות לילד: ${s.adaptations}.`);
  if (s.reinforcementPlan) lines.push(`תוכנית חיזוק: ${s.reinforcementPlan}.`);
  if (s.mediationPhrases) lines.push(`משפטי תיווך מומלצים: ${s.mediationPhrases}`);
  if (s.successSigns) lines.push(`סימני הצלחה לתשומת לב: ${s.successSigns}.`);
  if (s.ifDifficulty)
    lines.push(`במידה ומופיע קושי: ${s.ifDifficulty}.`);
  lines.push("");
  lines.push(
    "הערה: יש לשמר עקביות בין אנשי הצוות, להתאים את קצב המפגש לוויסות הילד באותו רגע, ולתעד את ההתרחשות לצורך מעקב.",
  );
  return lines.join("\n");
}

export function buildSessionParentVersion(s: SessionPlan): string {
  const lines: string[] = [];
  lines.push(`סיכום מפגש להורים`);
  lines.push(
    "להלן תיאור קצר וברור של מה עשינו במפגש וכיצד תוכלו להמשיך זאת בבית, באופן רגוע ומותאם.",
  );
  lines.push("");
  if (s.sessionGoal) lines.push(`על מה עבדנו: ${s.sessionGoal}.`);
  if (s.targetSkill)
    lines.push(`המיומנות שאותה אנו מקדמים: ${s.targetSkill}.`);
  if (s.mainActivity)
    lines.push(`מה עשינו במפגש: ${s.mainActivity}`);
  if (s.successSigns)
    lines.push(`איך נראית הצלחה: ${s.successSigns}`);
  if (s.mediationPhrases)
    lines.push(`משפטים שאפשר להשתמש בהם גם בבית: ${s.mediationPhrases}`);
  if (s.reinforcementPlan)
    lines.push(`איך לעודד ולחזק: ${s.reinforcementPlan}`);
  if (s.ifDifficulty)
    lines.push(
      `אם מופיע קושי – זה בסדר לגמרי. אפשר לנסות: ${s.ifDifficulty}`,
    );
  lines.push("");
  lines.push(
    "תזכורת חשובה: כל ילד מתקדם בקצב שלו. אנחנו כאן בשבילכם – תרגישו חופשיים לשתף שאלות, רעיונות או קשיים שעולים בבית.",
  );
  return lines.join("\n");
}
