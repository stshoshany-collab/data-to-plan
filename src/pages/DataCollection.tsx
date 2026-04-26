import { PlaceholderPage } from "@/components/PlaceholderPage";
import { ClipboardList } from "lucide-react";

const DataCollection = () => (
  <PlaceholderPage
    title="הפקת מידע"
    description="איסוף נתוני התבוננות, ראיונות, שאלונים ותצפיות שטח."
    icon={<ClipboardList className="h-6 w-6" />}
    sections={[
      { title: "תצפיות ABC", description: "תיעוד אנטצדנט – התנהגות – תוצאה במהלך המפגש." },
      { title: "ראיונות והערכות", description: "ראיונות הורים, צוות גן וכלי הערכה מובנים." },
      { title: "מדידות שכיחות ומשך", description: "כלים למעקב כמותי אחר התנהגויות מטרה." },
    ]}
  />
);

export default DataCollection;
