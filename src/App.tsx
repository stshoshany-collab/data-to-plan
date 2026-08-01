/**
 * Architecture
 * ─────────────
 * - Auth: Lovable Cloud (email + password). AuthProvider + AuthGuard wrap
 *   the app. /auth is the only public route.
 * - Persistence: All sensitive entities (cases, goals, ABC analyses,
 *   session plans, intervention plans, reports) live in Postgres with
 *   per-user RLS (owner_id = auth.uid()). Each table stores domain fields
 *   in a JSONB `data` column so existing TypeScript types keep working
 *   without per-field column mapping.
 * - localStorage is reserved for UI drafts and non-sensitive demo content
 *   (Activities library, Templates).
 * - All sensitive mutations write an audit_logs row (action, entity, entity_id).
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Cases from "./pages/Cases";
import DataCollection from "./pages/DataCollection";
import Analysis from "./pages/Analysis";
import Goals from "./pages/Goals";
import Sessions from "./pages/Sessions";
import Interventions from "./pages/Interventions";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";
import Export from "./pages/Export";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <AuthGuard>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/cases" element={<Cases />} />
                      <Route path="/data-collection" element={<DataCollection />} />
                      <Route path="/analysis" element={<Analysis />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/sessions" element={<Sessions />} />
                      <Route path="/interventions" element={<Interventions />} />
                      <Route path="/activities" element={<Activities />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/export" element={<Export />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </AuthGuard>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
