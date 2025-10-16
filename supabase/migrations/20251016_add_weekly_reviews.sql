-- Create weekly_reviews table
create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  triggers_learned text,
  grace_moments text,
  commitments_slipped text,
  outreach_needed text,
  single_focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

alter table weekly_reviews enable row level security;

create policy "Users can manage own weekly reviews"
  on weekly_reviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index idx_weekly_reviews_user_week on weekly_reviews(user_id, week_start desc);
