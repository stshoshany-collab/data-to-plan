import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Download } from "lucide-react";

const Export = () => (
  <PlaceholderPage
    title="ייצוא"
    description="ייצוא מסמכים ונתונים בפורמטים שונים – PDF, Word ו-Excel."
    icon={<Download className="h-6 w-6" />}
    sections={[
      { title: "ייצוא מסמכים", description: "הורדת תוכניות, דוחות וסיכומים בפורמט PDF או Word." },
      { title: "ייצוא נתונים", description: "טבלאות ומדידות בפורמט Excel/CSV לעיבוד נוסף." },
      { title: "שיתוף מאובטח", description: "יצירת קישורי שיתוף מוגבלים לבעלי עניין." },
    ]}
  />
);

export default Export;
