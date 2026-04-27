import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

/**
 * AuthGuard now allows instant access:
 * - If a user is signed in (email/password), use that session.
 * - Otherwise, sign the visitor in anonymously so RLS still works
 *   (every row gets owner_id = auth.uid()) without requiring an email.
 *
 * The user can still upgrade to a real account later via /auth.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [bootstrapping, setBootstrapping] = useState(false);

  useEffect(() => {
    if (loading || user || bootstrapping) return;
    setBootstrapping(true);
    supabase.auth.signInAnonymously().finally(() => setBootstrapping(false));
  }, [loading, user, bootstrapping]);

  if (loading || (!user && bootstrapping) || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
