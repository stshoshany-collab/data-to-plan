import { PlaceholderPage } from "@/components/PlaceholderPage";
import { FileStack } from "lucide-react";

const Templates = () => (
  <PlaceholderPage
    title="תבניות"
    description="תבניות מסמכים – תוכניות, דוחות, טפסים ומכתבים."
    icon={<FileStack className="h-6 w-6" />}
    sections={[
      { title: "תבניות תוכניות", description: "מבנים קבועים לכתיבת תוכניות התערבות מקצועיות." },
      { title: "תבניות דוחות", description: "פורמטים מובנים לסוגי הדוחות השונים." },
      { title: "תבניות הסכמה ושאלונים", description: "טפסים מוכנים לשימוש מול הורים וצוותים." },
    ]}
  />
);

export default Templates;
