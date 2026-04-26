import { PlaceholderPage } from "@/components/PlaceholderPage";
import { CalendarDays } from "lucide-react";

const Sessions = () => (
  <PlaceholderPage
    title="מערכי מפגש"
    description="תכנון מובנה של מפגשי משחק ולמידה – מטרות, פעילויות ומדידה."
    icon={<CalendarDays className="h-6 w-6" />}
    sections={[
      { title: "תכנון מפגש", description: "בחירת מטרות, פעילויות, חומרים ומבנה זמנים." },
      { title: "ביצוע ותיעוד", description: "תיעוד התרחשות המפגש, תגובות הילד והערות מקצועיות." },
      { title: "סיכום והמשך", description: "מסקנות מהמפגש והתאמות למפגש הבא." },
    ]}
  />
);

export default Sessions;
