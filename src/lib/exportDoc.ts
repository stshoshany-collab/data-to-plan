/**
 * Centralized export builder.
 *
 * Each artifact type (case, goal, session, intervention, activity, report)
 * is converted to a normalized "ExportDocument" with:
 *   - title, subtitle, meta (date + case)
 *   - structured sections (label + body)
 *
 * From this normalized form we render:
 *   - Plain text (for clipboard)
 *   - HTML (RTL, professional, used for Print + PDF + Word/HTML download)
 *
 * The HTML is intentionally self-contained (inline styles) so it can be
 * opened standalone, printed, or saved as .doc by Word/Google Docs without
 * loss of layout, and works even when the user is offline.
 *
 * ──────────────────────────────────────────────────────────────────────
 * FUTURE-READY NOTES
 * ──────────────────────────────────────────────────────────────────────
 * When the app is connected to a backend (Lovable Cloud / Supabase / Firebase),
 * the following extensions are designed to plug in cleanly:
 *   - replace local lookups with server-side fetches by id
 *   - add `ownerId` / `permissions` per artifact for RBAC
 *   - generate signed share URLs (parents/staff) instead of clipboard copy
 *   - send the same HTML to a server-side PDF renderer (e.g. Puppeteer)
 *   - call an AI gateway with the structured ExportDocument for richer prose
 */

import { Case } from "@/types/case";
import { Goal } from "@/types/goal";
import { SessionPlan, buildSessionStaffVersion, buildSessionParentVersion } from "@/types/session";
import { InterventionPlan, buildFullPlan } from "@/types/intervention";
import { Activity } from "@/types/activity";
import { Report, buildReport } from "@/types/report";

export type ExportKind =
  | "case"
  | "goal"
  | "session"
  | "intervention"
  | "activity"
  | "report";

export interface ExportSection {
  label: string;
  body: string;
}

export interface ExportDocument {
  kind: ExportKind;
  title: string;
  subtitle?: string;
  caseName?: string;
  date: string; // formatted he-IL
  sections: ExportSection[];
}

const fmtDate = (iso?: string) =>
  new Date(iso ?? Date.now()).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const KIND_LABELS: Record<ExportKind, string> = {
  case: "תיק מקרה",
  goal: "מטרת עבודה",
  session: "מערך מפגש",
  intervention: "תוכנית התערבות",
  activity: "פעילות מקצועית",
  report: "דוח מקצועי",
};

export const EXPORT_KIND_LABEL = (k: ExportKind) => KIND_LABELS[k];

/* ─────────── Builders per kind ─────────── */

export function buildCaseDoc(c: Case): ExportDocument {
  return {
    kind: "case",
    title: `תיק מקרה – ${c.name || "ללא שם"}`,
    subtitle: c.educationalSetting || undefined,
    caseName: c.name,
    date: fmtDate(c.updatedAt),
    sections: [
      { label: "פרטים כלליים", body:
        `שם / קוד: ${c.name || "—"}\nגיל: ${c.age ?? "—"}\nמסגרת חינוכית: ${c.educationalSetting || "—"}\nרמת תקשורת: ${c.communicationLevel || "—"}\nרמת תפקוד: ${c.functioningLevel || "—"}` },
      { label: "אבחנות / מאפיינים", body: c.diagnoses || "—" },
      { label: "תחומי חוזק", body: c.strengths || "—" },
      { label: "תחומי קושי", body: c.difficulties || "—" },
      { label: "תחומי עניין", body: c.interests || "—" },
      { label: "מחזקים אפשריים", body: c.reinforcers || "—" },
      { label: "רגישויות", body: c.sensitivities || "—" },
      { label: "הערות מקצועיות", body: c.professionalNotes || "—" },
    ],
  };
}

export function buildGoalDoc(g: Goal, caseName?: string): ExportDocument {
  return {
    kind: "goal",
    title: `מטרה – ${g.targetBehavior || "ללא כותרת"}`,
    subtitle: g.domain ? `תחום: ${g.domain}` : undefined,
    caseName,
    date: fmtDate(g.updatedAt),
    sections: [
      { label: "התנהגות / מיומנות יעד", body: g.targetBehavior || "—" },
      { label: "תנאים", body: g.conditions || "—" },
      { label: "מדד", body: g.measure || "—" },
      { label: "קריטריון הצלחה", body: g.successCriterion || "—" },
      { label: "תדירות מדידה", body: g.measurementFrequency || "—" },
      { label: "אחראים", body: g.responsible || "—" },
      { label: "ניסוח SMART מקצועי", body: g.professionalVersion || "—" },
      { label: "גרסה לצוות", body: g.staffVersion || "—" },
      { label: "גרסה להורים", body: g.parentVersion || "—" },
    ],
  };
}

export function buildSessionDoc(s: SessionPlan, caseName?: string): ExportDocument {
  return {
    kind: "session",
    title: `מערך מפגש – ${s.title || "ללא כותרת"}`,
    subtitle: [s.targetSkill, s.duration].filter(Boolean).join(" · ") || undefined,
    caseName,
    date: fmtDate(s.updatedAt),
    sections: [
      { label: "מטרת המפגש", body: s.sessionGoal || "—" },
      { label: "גיל יעד", body: s.targetAge || "—" },
      { label: "חומרים", body: s.materials || "—" },
      { label: "פתיחה", body: s.opening || "—" },
      { label: "ויסות / חימום", body: s.warmup || "—" },
      { label: "פעילות מרכזית", body: s.mainActivity || "—" },
      { label: "תרגול מודרך", body: s.guidedPractice || "—" },
      { label: "הכללה", body: s.generalization || "—" },
      { label: "סיכום", body: s.closing || "—" },
      { label: "משפטי תיווך", body: s.mediationPhrases || "—" },
      { label: "התאמות לילד", body: s.adaptations || "—" },
      { label: "תוכנית חיזוק", body: s.reinforcementPlan || "—" },
      { label: "סימני הצלחה", body: s.successSigns || "—" },
      { label: "במידה ומופיע קושי", body: s.ifDifficulty || "—" },
      { label: "גרסה לצוות", body: s.staffVersion || buildSessionStaffVersion(s) },
      { label: "גרסה להורים", body: s.parentVersion || buildSessionParentVersion(s) },
    ],
  };
}

export function buildInterventionDoc(p: InterventionPlan, caseName?: string): ExportDocument {
  return {
    kind: "intervention",
    title: `תוכנית התערבות – ${p.planName || p.targetBehavior || "ללא כותרת"}`,
    subtitle: p.targetBehavior || undefined,
    caseName,
    date: fmtDate(p.updatedAt),
    sections: [
      { label: "התנהגות מטרה", body: p.targetBehavior || "—" },
      { label: "הגדרה אובייקטיבית", body: p.objectiveDefinition || "—" },
      { label: "השערות תפקוד", body: p.functionHypotheses || "—" },
      { label: "אסטרטגיות מניעה", body: p.preventionStrategies || "—" },
      { label: "הוראה ישירה של מיומנויות חלופיות", body: p.directInstruction || "—" },
      { label: "מיומנויות חלופיות", body: p.alternativeSkills || "—" },
      { label: "חיזוקים", body: p.reinforcers || "—" },
      { label: "תגובת צוות מומלצת", body: p.staffResponse || "—" },
      { label: "מדידה", body: p.measurement || "—" },
      { label: "הכללה", body: p.generalization || "—" },
      { label: "הנחיות לצוות", body: p.staffGuidelines || "—" },
      { label: "הנחיות להורים", body: p.parentGuidelines || "—" },
      { label: "תוכנית מלאה (טקסט מקצועי)", body: p.fullPlan || buildFullPlan(p) },
    ],
  };
}

export function buildActivityDoc(a: Activity): ExportDocument {
  return {
    kind: "activity",
    title: `פעילות – ${a.name}`,
    subtitle: `${a.skillDomain} · ${a.approach} · גיל ${a.ageRange}`,
    date: fmtDate(),
    sections: [
      { label: "מטרה", body: a.goal },
      { label: "גיל יעד", body: a.ageRange },
      { label: "גישה מקצועית", body: a.approach },
      { label: "מסגרת", body: `${a.setting} · משך ${a.durationMinutes} דקות · רמת שפה: ${a.languageLevel}` },
      { label: "חומרים", body: a.materials },
      { label: "שלבים", body: a.steps },
      { label: "משפטי תיווך", body: a.mediationPhrases },
      { label: "התאמות", body: a.adaptations },
      { label: "מדד הצלחה", body: a.successMeasure },
      { label: "רעיונות להכללה", body: a.generalizationIdeas },
    ],
  };
}

export function buildReportDoc(r: Report, caseName?: string): ExportDocument {
  return {
    kind: "report",
    title: r.type,
    subtitle: caseName,
    caseName,
    date: fmtDate(r.date),
    sections: [
      { label: "תאריך", body: fmtDate(r.date) },
      { label: "נוכחים", body: r.participants || "—" },
      { label: "מטרות", body: r.goals || "—" },
      { label: "מה נעשה", body: r.whatWasDone || "—" },
      { label: "תגובת הילד/ה", body: r.childResponse || "—" },
      { label: "תוצאות", body: r.results || "—" },
      { label: "מסקנות", body: r.conclusions || "—" },
      { label: "המלצות להמשך", body: r.recommendations || "—" },
      { label: "טקסט הדוח", body: r.generatedText || buildReport(r, caseName ?? "") },
    ],
  };
}

/* ─────────── Renderers ─────────── */

export function toPlainText(doc: ExportDocument): string {
  const lines: string[] = [];
  lines.push(doc.title);
  if (doc.subtitle) lines.push(doc.subtitle);
  lines.push(`תאריך: ${doc.date}`);
  if (doc.caseName) lines.push(`מקרה: ${doc.caseName}`);
  lines.push("");
  for (const sec of doc.sections) {
    lines.push(`${sec.label}:`);
    lines.push(sec.body);
    lines.push("");
  }
  lines.push("—");
  lines.push(`נוצר באמצעות: ניתוח התנהגות יישומי מקדם – ממידע לתוכניות עבודה`);
  return lines.join("\n");
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function toHtml(doc: ExportDocument): string {
  const sections = doc.sections
    .map(
      (s) => `
      <section>
        <h2>${escapeHtml(s.label)}</h2>
        <p>${escapeHtml(s.body).replace(/\n/g, "<br/>")}</p>
      </section>`,
    )
    .join("");

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(doc.title)}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Assistant','Heebo','Arial',sans-serif;
    color: #1a2733;
    background: #fff;
    margin: 0;
    padding: 24px;
    line-height: 1.65;
    direction: rtl;
  }
  .doc { max-width: 780px; margin: 0 auto; }
  header.top {
    border-bottom: 2px solid #2a8aa3;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .kind {
    color: #2a8aa3;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  h1 { font-size: 22px; margin: 4px 0 6px; color: #0f2535; }
  .subtitle { color: #4a6072; font-size: 14px; margin: 0; }
  .meta {
    display: flex; gap: 16px; flex-wrap: wrap;
    color: #5b6b7a; font-size: 12px; margin-top: 10px;
  }
  .meta span strong { color: #1a2733; }
  section { margin: 14px 0; page-break-inside: avoid; }
  h2 {
    font-size: 13px;
    color: #2a8aa3;
    text-transform: none;
    margin: 0 0 4px;
    border-right: 3px solid #2a8aa3;
    padding-right: 8px;
  }
  p { margin: 0; white-space: pre-wrap; font-size: 14px; color: #233241; }
  footer {
    margin-top: 24px;
    border-top: 1px solid #d8e0e6;
    padding-top: 10px;
    color: #7a8896;
    font-size: 11px;
    text-align: center;
  }
  @media print {
    body { padding: 0; }
  }
</style>
</head>
<body>
  <div class="doc">
    <header class="top">
      <div class="kind">${escapeHtml(KIND_LABELS[doc.kind])}</div>
      <h1>${escapeHtml(doc.title)}</h1>
      ${doc.subtitle ? `<p class="subtitle">${escapeHtml(doc.subtitle)}</p>` : ""}
      <div class="meta">
        <span><strong>תאריך:</strong> ${escapeHtml(doc.date)}</span>
        ${doc.caseName ? `<span><strong>מקרה:</strong> ${escapeHtml(doc.caseName)}</span>` : ""}
      </div>
    </header>
    ${sections}
    <footer>
      נוצר באמצעות: ניתוח התנהגות יישומי מקדם – ממידע לתוכניות עבודה
    </footer>
  </div>
</body>
</html>`;
}

/* ─────────── File / clipboard helpers ─────────── */

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadHtml(doc: ExportDocument) {
  const html = toHtml(doc);
  downloadBlob(`${doc.title}.html`, new Blob([html], { type: "text/html;charset=utf-8" }));
}

/**
 * Word-compatible export. Word and Google Docs both open .doc files
 * containing standalone HTML – preserving the RTL Hebrew layout, headings
 * and structure better than a plain-text fallback.
 */
export function downloadWord(doc: ExportDocument) {
  const html = toHtml(doc);
  downloadBlob(
    `${doc.title}.doc`,
    new Blob(["\ufeff", html], { type: "application/msword" }),
  );
}

/**
 * Basic PDF export – opens a print-ready window. The user picks
 * "Save as PDF" in the system dialog. Works fully offline, in every
 * browser, and produces clean Hebrew/RTL output thanks to the inline CSS.
 *
 * Future: replace with a server-side renderer (Puppeteer / pdf-lib) to
 * produce identical PDFs without a dialog.
 */
export function printDoc(doc: ExportDocument) {
  const html = toHtml(doc);
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!w) {
    throw new Error("חלון ההדפסה נחסם על ידי הדפדפן. אפשרי לאפשר חלונות קופצים ולנסות שוב.");
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  // Wait for fonts/layout, then trigger print
  const trigger = () => {
    try {
      w.focus();
      w.print();
    } catch {
      /* swallow – user can print manually */
    }
  };
  if (w.document.readyState === "complete") {
    setTimeout(trigger, 300);
  } else {
    w.addEventListener("load", () => setTimeout(trigger, 300));
  }
}
