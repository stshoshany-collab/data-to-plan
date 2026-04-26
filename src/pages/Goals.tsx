import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Target } from "lucide-react";

const Goals = () => (
  <PlaceholderPage
    title="מטרות"
    description="ניסוח מטרות לשינוי, הגברה ולמידה – מדידות וברות השגה."
    icon={<Target className="h-6 w-6" />}
    sections={[
      { title: "מטרות שינוי", description: "הפחתה של התנהגויות לא רצויות וחלופות מתאימות." },
      { title: "מטרות הגברה", description: "חיזוק התנהגויות חיוביות קיימות והרחבת יישומן." },
      { title: "מטרות למידה", description: "רכישת מיומנויות חדשות – חברתיות, תקשורתיות וויסות." },
    ]}
  />
);

export default Goals;
