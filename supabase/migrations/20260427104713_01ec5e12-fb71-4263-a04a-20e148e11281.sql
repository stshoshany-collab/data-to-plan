-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT,
  organization TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 3. Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. Generic owner-scoped tables
-- ============================================================

-- CASES
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE INDEX cases_owner_idx ON public.cases(owner_id);
CREATE TRIGGER cases_set_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Owner select cases" ON public.cases FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert cases" ON public.cases FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update cases" ON public.cases FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete cases" ON public.cases FOR DELETE USING (auth.uid() = owner_id);

-- GOALS
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE INDEX goals_owner_idx ON public.goals(owner_id);
CREATE TRIGGER goals_set_updated_at BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Owner select goals" ON public.goals FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update goals" ON public.goals FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete goals" ON public.goals FOR DELETE USING (auth.uid() = owner_id);

-- ABC OBSERVATIONS
CREATE TABLE public.abc_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.abc_observations ENABLE ROW LEVEL SECURITY;
CREATE INDEX abc_owner_idx ON public.abc_observations(owner_id);
CREATE TRIGGER abc_set_updated_at BEFORE UPDATE ON public.abc_observations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Owner select abc" ON public.abc_observations FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert abc" ON public.abc_observations FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update abc" ON public.abc_observations FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete abc" ON public.abc_observations FOR DELETE USING (auth.uid() = owner_id);

-- SESSION PLANS
CREATE TABLE public.session_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.session_plans ENABLE ROW LEVEL SECURITY;
CREATE INDEX session_plans_owner_idx ON public.session_plans(owner_id);
CREATE TRIGGER session_plans_set_updated_at BEFORE UPDATE ON public.session_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Owner select session_plans" ON public.session_plans FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert session_plans" ON public.session_plans FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update session_plans" ON public.session_plans FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete session_plans" ON public.session_plans FOR DELETE USING (auth.uid() = owner_id);

-- INTERVENTION PLANS
CREATE TABLE public.intervention_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.intervention_plans ENABLE ROW LEVEL SECURITY;
CREATE INDEX intervention_plans_owner_idx ON public.intervention_plans(owner_id);
CREATE TRIGGER intervention_plans_set_updated_at BEFORE UPDATE ON public.intervention_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Owner select intervention_plans" ON public.intervention_plans FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert intervention_plans" ON public.intervention_plans FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update intervention_plans" ON public.intervention_plans FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete intervention_plans" ON public.intervention_plans FOR DELETE USING (auth.uid() = owner_id);

-- REPORTS
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE INDEX reports_owner_idx ON public.reports(owner_id);
CREATE TRIGGER reports_set_updated_at BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Owner select reports" ON public.reports FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update reports" ON public.reports FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete reports" ON public.reports FOR DELETE USING (auth.uid() = owner_id);

-- AUDIT LOGS (append + read only by owner)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX audit_owner_idx ON public.audit_logs(owner_id, created_at DESC);
CREATE POLICY "Owner select audit" ON public.audit_logs FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert audit" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = owner_id);