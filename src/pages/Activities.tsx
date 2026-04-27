import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import {
  Activity,
  APPROACHES,
  Approach,
  demoActivities,
  LANGUAGE_LEVELS,
  LanguageLevel,
  SETTINGS,
  Setting,
  SKILL_DOMAINS,
} from "@/types/activity";
import { Library, Search, Filter } from "lucide-react";

const STORAGE_KEY = "ba-app:activities:v1";
const ANY = "__any__";

const Activities = () => {
  const [activities] = useLocalStorageState<Activity[]>(STORAGE_KEY, demoActivities);
  const [search, setSearch] = useState("");
  const [age, setAge] = useState<string>("");
  const [domain, setDomain] = useState<string>(ANY);
  const [approach, setApproach] = useState<string>(ANY);
  const [setting, setSetting] = useState<string>(ANY);
  const [duration, setDuration] = useState<string>(ANY);
  const [language, setLanguage] = useState<string>(ANY);
  const [materialsFilter, setMaterialsFilter] = useState("");
  const [selected, setSelected] = useState<Activity | null>(null);

  const filtered = useMemo(() => {
    const ageNum = age ? Number(age) : null;
    const q = search.trim().toLowerCase();
    const m = materialsFilter.trim().toLowerCase();
    return activities.filter((a) => {
      if (ageNum !== null && !Number.isNaN(ageNum)) {
        if (ageNum < a.ageMin || ageNum > a.ageMax) return false;
      }
      if (domain !== ANY && a.skillDomain !== domain) return false;
      if (approach !== ANY && a.approach !== approach) return false;
      if (setting !== ANY && a.setting !== setting) return false;
      if (language !== ANY && a.languageLevel !== language) return false;
      if (duration !== ANY) {
        const d = a.durationMinutes;
        if (duration === "short" && d > 15) return false;
        if (duration === "med" && (d <= 15 || d > 25)) return false;
        if (duration === "long" && d <= 25) return false;
      }
      if (m && !a.materials.toLowerCase().includes(m)) return false;
      if (q) {
        const blob = `${a.name} ${a.goal} ${a.skillDomain} ${a.steps}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [activities, age, domain, approach, setting, duration, language, materialsFilter, search]);

  const reset = () => {
    setSearch("");
    setAge("");
    setDomain(ANY);
    setApproach(ANY);
    setSetting(ANY);
    setDuration(ANY);
    setLanguage(ANY);
    setMaterialsFilter("");
  };

  return (
    <div>
      <PageHeader
        title="מאגר פעילויות"
        description="ספריית פעילויות מקצועית עם סינון לפי גיל, תחום, גישה ומשך."
      />

      <Card className="shadow-card mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">סינון</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          <div className="space-y-1.5 md:col-span-2">
            <Label>חיפוש חופשי</Label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חפש לפי שם / מטרה / שלבים"
                className="pe-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>גיל</Label>
            <Input
              type="number"
              min={1}
              max={18}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="כל הגילים"
            />
          </div>

          <div className="space-y-1.5">
            <Label>תחום מיומנות</Label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>הכול</SelectItem>
                {SKILL_DOMAINS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>גישה</Label>
            <Select value={approach} onValueChange={setApproach}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>הכול</SelectItem>
                {APPROACHES.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>פרטני / קבוצתי</Label>
            <Select value={setting} onValueChange={setSetting}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>הכול</SelectItem>
                {SETTINGS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>משך זמן</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>הכול</SelectItem>
                <SelectItem value="short">קצר (עד 15 ד׳)</SelectItem>
                <SelectItem value="med">בינוני (16-25 ד׳)</SelectItem>
                <SelectItem value="long">ארוך (מעל 25 ד׳)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>רמת שפה</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>הכול</SelectItem>
                {LANGUAGE_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>חומרים זמינים</Label>
            <Input
              value={materialsFilter}
              onChange={(e) => setMaterialsFilter(e.target.value)}
              placeholder="למשל: טיימר, כרטיסיות"
            />
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={reset} className="w-full">איפוס סינון</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-3 text-sm text-muted-foreground">
        נמצאו {filtered.length} פעילויות מתוך {activities.length}
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Library className="h-10 w-10 mx-auto mb-3 opacity-50" />
            לא נמצאו פעילויות התואמות לסינון.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <Card
              key={a.id}
              className="shadow-card cursor-pointer hover:shadow-elegant transition-shadow"
              onClick={() => setSelected(a)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">{a.name}</CardTitle>
                  <Badge variant="secondary">{a.approach}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{a.goal}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="font-normal">{a.skillDomain}</Badge>
                  <Badge variant="outline" className="font-normal">גיל {a.ageRange}</Badge>
                  <Badge variant="outline" className="font-normal">{a.durationMinutes} ד׳</Badge>
                  <Badge variant="outline" className="font-normal">{a.setting}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.name}</DialogTitle>
                <DialogDescription>{selected.goal}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5 mb-2">
                <Badge>{selected.approach}</Badge>
                <Badge variant="outline">{selected.skillDomain}</Badge>
                <Badge variant="outline">גיל {selected.ageRange}</Badge>
                <Badge variant="outline">{selected.durationMinutes} ד׳</Badge>
                <Badge variant="outline">{selected.setting}</Badge>
                <Badge variant="outline">שפה: {selected.languageLevel}</Badge>
              </div>
              <Section title="חומרים" body={selected.materials} />
              <Section title="שלבים" body={selected.steps} />
              <Section title="משפטי תיווך" body={selected.mediationPhrases} />
              <Section title="התאמות" body={selected.adaptations} />
              <Section title="מדד הצלחה" body={selected.successMeasure} />
              <Section title="רעיונות להכללה" body={selected.generalizationIdeas} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({ title, body }: { title: string; body: string }) => (
  <div className="mt-3">
    <h3 className="text-sm font-semibold mb-1">{title}</h3>
    <p className="text-sm whitespace-pre-wrap text-muted-foreground">{body}</p>
  </div>
);

export default Activities;
