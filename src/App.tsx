/**
 * App-wide architecture & future-readiness notes
 * ──────────────────────────────────────────────
 *
 * Persistence
 *   All entities are currently kept in `localStorage` via two abstractions:
 *     - useLocalStorageState<T>(key, init)     – generic, used everywhere
 *     - useCases()                             – domain hook for cases
 *   Storage keys are namespaced under `ba-app:<entity>:v1` so a future
 *   migration script can identify and convert them safely.
 *
 * Future backend (Lovable Cloud / Supabase / Firebase)
 *   When enabling a backend:
 *     1. Replace the body of `useLocalStorageState` (or the per-entity hook)
 *        with a TanStack Query hook that fetches/mutates remote data.
 *     2. Add an `ownerId` field on each entity (Case, Goal, …) – the type
 *        files already group fields cleanly so this is additive only.
 *     3. Introduce RLS on the server (e.g. Supabase policies):
 *        owner can do everything, collaborators get scoped read/write,
 *        parents get read-only on shared artifacts.
 *
 * Auth
 *   No auth today. The Settings page already has a "future" section
 *   describing roles (analyst / staff / parent). When wiring auth:
 *     - wrap routes with an <AuthGuard /> component
 *     - load the current user via a `useCurrentUser()` hook
 *     - gate destructive actions behind role checks
 *
 * AI
 *   All "מחוללים" (SMART, session staff/parent versions, full plan, report)
 *   are currently deterministic functions in `src/types/*.ts`.
 *   Each one returns a string and takes the entity as input – swapping in
 *   an AI call (Lovable AI Gateway / OpenAI) is a one-function change
 *   per generator.
 *
 * Sharing
 *   The Export module produces clean, self-contained HTML for every artifact.
 *   Once a backend exists, the same HTML can be uploaded and served via a
 *   signed share URL – no template changes needed.
 *
 * Accessibility & RTL
 *   `<html dir="rtl">` is set globally in index.css. All Dialogs and
 *   AlertDialogs receive `dir="rtl"` explicitly. All copy is in Hebrew.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
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
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
