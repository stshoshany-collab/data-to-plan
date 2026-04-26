import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Library } from "lucide-react";

const Activities = () => (
  <PlaceholderPage
    title="מאגר פעילויות"
    description="פעילויות מותאמות לפי גיל, מטרה ותחום התפתחותי."
    icon={<Library className="h-6 w-6" />}
    sections={[
      { title: "סינון לפי מטרה", description: "מציאת פעילויות מתאימות למטרות ספציפיות בתוכנית." },
      { title: "פעילויות מומלצות", description: "אוסף פעילויות מוצלחות ומבוססות ניסיון מקצועי." },
      { title: "הוספת פעילות", description: "הוספת פעילויות חדשות עם הוראות, חומרים והתאמות." },
    ]}
  />
);

export default Activities;
