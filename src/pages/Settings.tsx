import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => (
  <PlaceholderPage
    title="הגדרות"
    description="הגדרות פרופיל, העדפות מערכת והרשאות."
    icon={<SettingsIcon className="h-6 w-6" />}
    sections={[
      { title: "פרופיל אישי", description: "פרטי מנתחת ההתנהגות, פרטי קשר וחתימה דיגיטלית." },
      { title: "העדפות מערכת", description: "תצוגה, התראות, ברירות מחדל לטפסים ולדוחות." },
      { title: "אבטחה ופרטיות", description: "סיסמה, הרשאות גישה ושמירת מידע רגיש." },
    ]}
  />
);

export default Settings;
