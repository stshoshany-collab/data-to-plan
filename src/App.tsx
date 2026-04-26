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
