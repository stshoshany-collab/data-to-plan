import { PlaceholderPage } from "@/components/PlaceholderPage";
import { BarChart3 } from "lucide-react";

const Reports = () => (
  <PlaceholderPage
    title="דוחות"
    description="דוחות סיכום, התקדמות והמלצות להמשך עבודה."
    icon={<BarChart3 className="h-6 w-6" />}
    sections={[
      { title: "דוח התקדמות", description: "סיכום תקופתי של הישגי המטרות ומגמות ההתנהגות." },
      { title: "דוח סיכום מקרה", description: "סקירה כוללת בסיום ההתערבות והמלצות להמשך." },
      { title: "דוחות להורים ולצוות", description: "דוחות מותאמים בשפה נגישה לבעלי העניין." },
    ]}
  />
);

export default Reports;
