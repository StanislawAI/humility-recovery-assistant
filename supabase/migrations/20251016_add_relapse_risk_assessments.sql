-- Create relapse_risk_assessments table
create table if not exists relapse_risk_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  sleep_risk text check (sleep_risk in ('low', 'medium', 'high')),
  stress_risk text check (stress_risk in ('low', 'medium', 'high')),
  isolation_risk text check (isolation_risk in ('low', 'medium', 'high')),
  halt_risk text check (halt_risk in ('low', 'medium', 'high')),
  spirituality_risk text check (spirituality_risk in ('low', 'medium', 'high')),
  service_risk text check (service_risk in ('low', 'medium', 'high')),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table relapse_risk_assessments enable row level security;

create policy "Users can manage own relapse risk assessments"
  on relapse_risk_assessments for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_relapse_risk_user_date on relapse_risk_assessments(user_id, date desc);
