
-- ============ public schema: recreate all policies for authenticated only ============

-- abc_observations
DROP POLICY IF EXISTS "Owner select abc" ON public.abc_observations;
DROP POLICY IF EXISTS "Owner insert abc" ON public.abc_observations;
DROP POLICY IF EXISTS "Owner update abc" ON public.abc_observations;
DROP POLICY IF EXISTS "Owner delete abc" ON public.abc_observations;
ALTER TABLE public.abc_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select abc" ON public.abc_observations FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert abc" ON public.abc_observations FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update abc" ON public.abc_observations FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete abc" ON public.abc_observations FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- audit_logs
DROP POLICY IF EXISTS "Owner select audit" ON public.audit_logs;
DROP POLICY IF EXISTS "Owner insert audit" ON public.audit_logs;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select audit" ON public.audit_logs FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- cases
DROP POLICY IF EXISTS "Owner select cases" ON public.cases;
DROP POLICY IF EXISTS "Owner insert cases" ON public.cases;
DROP POLICY IF EXISTS "Owner update cases" ON public.cases;
DROP POLICY IF EXISTS "Owner delete cases" ON public.cases;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select cases" ON public.cases FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert cases" ON public.cases FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update cases" ON public.cases FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete cases" ON public.cases FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- exports
DROP POLICY IF EXISTS "Owner select exports" ON public.exports;
DROP POLICY IF EXISTS "Owner insert exports" ON public.exports;
DROP POLICY IF EXISTS "Owner delete exports" ON public.exports;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select exports" ON public.exports FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert exports" ON public.exports FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete exports" ON public.exports FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- files
DROP POLICY IF EXISTS "Owner select files" ON public.files;
DROP POLICY IF EXISTS "Owner insert files" ON public.files;
DROP POLICY IF EXISTS "Owner update files" ON public.files;
DROP POLICY IF EXISTS "Owner delete files" ON public.files;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select files" ON public.files FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert files" ON public.files FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update files" ON public.files FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete files" ON public.files FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- goals
DROP POLICY IF EXISTS "Owner select goals" ON public.goals;
DROP POLICY IF EXISTS "Owner insert goals" ON public.goals;
DROP POLICY IF EXISTS "Owner update goals" ON public.goals;
DROP POLICY IF EXISTS "Owner delete goals" ON public.goals;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select goals" ON public.goals FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update goals" ON public.goals FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete goals" ON public.goals FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- intervention_plans
DROP POLICY IF EXISTS "Owner select intervention_plans" ON public.intervention_plans;
DROP POLICY IF EXISTS "Owner insert intervention_plans" ON public.intervention_plans;
DROP POLICY IF EXISTS "Owner update intervention_plans" ON public.intervention_plans;
DROP POLICY IF EXISTS "Owner delete intervention_plans" ON public.intervention_plans;
ALTER TABLE public.intervention_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select intervention_plans" ON public.intervention_plans FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert intervention_plans" ON public.intervention_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update intervention_plans" ON public.intervention_plans FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete intervention_plans" ON public.intervention_plans FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- reports
DROP POLICY IF EXISTS "Owner select reports" ON public.reports;
DROP POLICY IF EXISTS "Owner insert reports" ON public.reports;
DROP POLICY IF EXISTS "Owner update reports" ON public.reports;
DROP POLICY IF EXISTS "Owner delete reports" ON public.reports;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select reports" ON public.reports FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update reports" ON public.reports FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete reports" ON public.reports FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- session_plans
DROP POLICY IF EXISTS "Owner select session_plans" ON public.session_plans;
DROP POLICY IF EXISTS "Owner insert session_plans" ON public.session_plans;
DROP POLICY IF EXISTS "Owner update session_plans" ON public.session_plans;
DROP POLICY IF EXISTS "Owner delete session_plans" ON public.session_plans;
ALTER TABLE public.session_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner select session_plans" ON public.session_plans FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert session_plans" ON public.session_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update session_plans" ON public.session_plans FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete session_plans" ON public.session_plans FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- profiles
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- revoke any anon access at the grant level as well
REVOKE ALL ON public.abc_observations FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;
REVOKE ALL ON public.cases FROM anon;
REVOKE ALL ON public.exports FROM anon;
REVOKE ALL ON public.files FROM anon;
REVOKE ALL ON public.goals FROM anon;
REVOKE ALL ON public.intervention_plans FROM anon;
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.reports FROM anon;
REVOKE ALL ON public.session_plans FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.abc_observations TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.exports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.files TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.intervention_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.session_plans TO authenticated;

-- ============ storage.objects: authenticated only, owner-scoped ============
DROP POLICY IF EXISTS "Users read own case files" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own case files" ON storage.objects;
DROP POLICY IF EXISTS "Users update own case files" ON storage.objects;
DROP POLICY IF EXISTS "Users delete own case files" ON storage.objects;

CREATE POLICY "Users read own case files" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'case-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own case files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'case-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
CREATE POLICY "Users update own case files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'case-files' AND (auth.uid())::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'case-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own case files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'case-files' AND (auth.uid())::text = (storage.foldername(name))[1]);
