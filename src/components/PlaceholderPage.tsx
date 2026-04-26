import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: ReactNode;
  sections?: { title: string; description: string }[];
}

export function PlaceholderPage({ title, description, icon, sections = [] }: PlaceholderPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />

      <Card className="shadow-card border-dashed bg-gradient-soft mb-6">
        <CardContent className="flex items-start gap-4 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon ?? <Construction className="h-6 w-6" />}
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">המסך בבנייה</h2>
            <p className="text-sm text-muted-foreground">
              זהו שלד ראשוני של המסך. הלוגיקה והתכנים המלאים יתווספו בשלבים הבאים של הפיתוח.
            </p>
          </div>
        </CardContent>
      </Card>

      {sections.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
