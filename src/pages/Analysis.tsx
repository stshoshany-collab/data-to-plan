import { PlaceholderPage } from "@/components/PlaceholderPage";
import { Brain } from "lucide-react";

const Analysis = () => (
  <PlaceholderPage
    title="ניתוח מקרה"
    description="ניתוח פונקציונלי של ההתנהגות, זיהוי דפוסים והבנת הקשר."
    icon={<Brain className="h-6 w-6" />}
    sections={[
      { title: "ניתוח פונקציונלי", description: "זיהוי פונקציה: בריחה, השגה, גירוי חושי או תשומת לב." },
      { title: "השערות עבודה", description: "ניסוח השערות לגבי תפקיד ההתנהגות והגורמים המשפיעים." },
      { title: "סיכום ממצאים", description: "תמצית הניתוח כבסיס לבניית מטרות ותוכניות התערבות." },
    ]}
  />
);

export default Analysis;
