-- Create user_settings table
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  emergency_contacts jsonb not null default '[]'::jsonb,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table user_settings enable row level security;

create policy "Users can view own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on user_settings for update
  using (auth.uid() = user_id);

-- Create daily_checklists table
create table if not exists daily_checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table daily_checklists enable row level security;

create policy "Users can manage own checklists"
  on daily_checklists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create urge_logs table
create table if not exists urge_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  trigger text,
  intensity int check (intensity >= 1 and intensity <= 10),
  tools_used text[],
  result text,
  lesson text
);

alter table urge_logs enable row level security;

create policy "Users can manage own urge logs"
  on urge_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create if_then_plans table
create table if not exists if_then_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trigger text not null,
  action text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if_then_plans enable row level security;

create policy "Users can manage own if-then plans"
  on if_then_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create daily_metrics table
create table if not exists daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  conn smallint,
  pray smallint,
  move smallint,
  mind smallint,
  service smallint,
  sleep numeric(3,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table daily_metrics enable row level security;

create policy "Users can manage own daily metrics"
  on daily_metrics for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create exercises_sessions table
create table if not exists exercises_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  notes text,
  duration_sec int,
  created_at timestamptz not null default now()
);

alter table exercises_sessions enable row level security;

create policy "Users can manage own exercise sessions"
  on exercises_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
