import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FileText } from "lucide-react";

const Interventions = () => (
  <PlaceholderPage
    title="תוכניות התערבות"
    description="כתיבת תוכניות עבודה מובנות, עם שלבים, מדדים ולוחות זמנים."
    icon={<FileText className="h-6 w-6" />}
    sections={[
      { title: "תוכנית מרכזית", description: "ראייה כוללת של ההתערבות עם מטרות ושלבי ביצוע." },
      { title: "אסטרטגיות וכלים", description: "טכניקות התנהגותיות, סיוע, חיזוק והכחדה." },
      { title: "מדידה והערכה", description: "מדדי הצלחה, נקודות בקרה ותדירות מעקב." },
    ]}
  />
);

export default Interventions;
