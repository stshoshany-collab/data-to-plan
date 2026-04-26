import {
  LayoutDashboard,
  FolderOpen,
  ClipboardList,
  Brain,
  Target,
  CalendarDays,
  FileText,
  Library,
  BarChart3,
  FileStack,
  Download,
  Settings,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

export const navItems: NavItem[] = [
  { title: "דשבורד", url: "/", icon: LayoutDashboard, description: "סקירה כללית" },
  { title: "מקרים", url: "/cases", icon: FolderOpen, description: "ניהול מקרים פעילים" },
  { title: "הפקת מידע", url: "/data-collection", icon: ClipboardList, description: "איסוף נתונים והתבוננויות" },
  { title: "ניתוח מקרה", url: "/analysis", icon: Brain, description: "ניתוח פונקציונלי והתנהגותי" },
  { title: "מטרות", url: "/goals", icon: Target, description: "ניסוח מטרות שינוי, הגברה ולמידה" },
  { title: "מערכי מפגש", url: "/sessions", icon: CalendarDays, description: "תכנון מפגשי משחק ולמידה" },
  { title: "תוכניות התערבות", url: "/interventions", icon: FileText, description: "תוכניות עבודה מובנות" },
  { title: "מאגר פעילויות", url: "/activities", icon: Library, description: "פעילויות מותאמות" },
  { title: "דוחות", url: "/reports", icon: BarChart3, description: "דוחות סיכום והמלצות" },
  { title: "תבניות", url: "/templates", icon: FileStack, description: "תבניות מסמכים" },
  { title: "ייצוא", url: "/export", icon: Download, description: "ייצוא נתונים ומסמכים" },
  { title: "הגדרות", url: "/settings", icon: Settings, description: "הגדרות מערכת" },
];
