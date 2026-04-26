import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FolderOpen } from "lucide-react";

const Cases = () => (
  <PlaceholderPage
    title="מקרים"
    description="ניהול כל המקרים – הוספה, עריכה, מעקב וסגירה."
    icon={<FolderOpen className="h-6 w-6" />}
    sections={[
      { title: "פתיחת מקרה חדש", description: "פרטי ילד, רקע משפחתי, סיבת הפנייה ואנשי מקצוע מלווים." },
      { title: "רשימת מקרים פעילים", description: "סינון לפי סטטוס, תאריך פתיחה ושלב התקדמות." },
      { title: "ארכיון מקרים", description: "מקרים סגורים עם סיכום ודוחות מסכמים." },
    ]}
  />
);

export default Cases;
