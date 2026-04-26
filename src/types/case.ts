export type CommunicationLevel =
  | "ללא דיבור"
  | "מילים בודדות"
  | "צירופי מילים"
  | "משפטים פשוטים"
  | "שפה תקינה לגיל";

export type FunctioningLevel =
  | "תלוי מאוד בסיוע"
  | "זקוק לסיוע משמעותי"
  | "זקוק לסיוע חלקי"
  | "עצמאי ברוב התחומים"
  | "עצמאי";

export const COMMUNICATION_LEVELS: CommunicationLevel[] = [
  "ללא דיבור",
  "מילים בודדות",
  "צירופי מילים",
  "משפטים פשוטים",
  "שפה תקינה לגיל",
];

export const FUNCTIONING_LEVELS: FunctioningLevel[] = [
  "תלוי מאוד בסיוע",
  "זקוק לסיוע משמעותי",
  "זקוק לסיוע חלקי",
  "עצמאי ברוב התחומים",
  "עצמאי",
];

export interface Case {
  id: string;
  name: string;
  age: number | null;
  educationalSetting: string;
  diagnoses: string;
  strengths: string;
  difficulties: string;
  communicationLevel: CommunicationLevel | "";
  functioningLevel: FunctioningLevel | "";
  interests: string;
  reinforcers: string;
  sensitivities: string;
  professionalNotes: string;
  createdAt: string;
  updatedAt: string;
}

export const createEmptyCase = (): Case => ({
  id: crypto.randomUUID(),
  name: "",
  age: null,
  educationalSetting: "",
  diagnoses: "",
  strengths: "",
  difficulties: "",
  communicationLevel: "",
  functioningLevel: "",
  interests: "",
  reinforcers: "",
  sensitivities: "",
  professionalNotes: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const demoCases: Case[] = [
  {
    id: "demo-case-1",
    name: "א׳",
    age: 6,
    educationalSetting: "כיתה א׳",
    diagnoses: "קשיי קשב וויסות",
    strengths: "סקרנות, עניין בחיות, הבנת הוראות קצרות",
    difficulties: "כתיבה, המתנה, תגובה לדרישות לימודיות",
    communicationLevel: "משפטים פשוטים",
    functioningLevel: "זקוק לסיוע חלקי",
    interests: "חיות, פאזלים, ציור",
    reinforcers: "מדבקות, בחירה בין שתי פעילויות, משחק קצר",
    sensitivities: "רעשים חזקים, מעבר פתאומי בין פעילויות",
    professionalNotes:
      "מגיב היטב להוראות חזותיות ולוח שגרה. כדאי לבסס שגרה ברורה ולהשתמש בטיימר להמתנה.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];
