import { ReactNode } from "react";
import { Bell, LogOut, Search, UserCircle2 } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logAudit } from "@/lib/auditLog";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const handleSignOut = async () => {
    await logAudit("signout", "auth", null, { email: user?.email });
    await signOut();
    toast.success("התנתקת בהצלחה");
  };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="app-header h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30" data-no-print>
            <div className="h-full flex items-center justify-between gap-4 px-4 md:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <SidebarTrigger className="shrink-0" />
                <div className="hidden md:flex flex-col leading-tight min-w-0">
                  <h1 className="text-base font-semibold truncate">
                    ניתוח התנהגות יישומי מקדם
                  </h1>
                  <span className="text-xs text-muted-foreground truncate">
                    ממידע לתוכניות עבודה
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש מקרה, מטרה או מסמך..."
                    className="pr-9 w-64 lg:w-80 bg-background"
                  />
                </div>
                <Button variant="ghost" size="icon" aria-label="התראות">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="פרופיל">
                      <UserCircle2 className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-right">
                      <div className="text-sm font-medium truncate">
                        {user?.email || "אורח/ת"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user?.email ? "מחוברת" : "מצב גישה מהירה"}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!user?.email && (
                      <DropdownMenuItem asChild>
                        <a href="/auth">יצירת חשבון או התחברות</a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="ms-2 h-4 w-4" />
                      התנתקות
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
