-- Enable RPC to execute SQL statements securely using the service role only
-- One-time setup: run this file in Supabase SQL Editor first

create or replace function public.exec_sql(sql_query text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt json;
  role text;
begin
  -- Read JWT claims (available to PostgREST)
  select coalesce(current_setting('request.jwt.claims', true), '{}')::json into jwt;
  role := coalesce(jwt->>'role', 'anon');

  -- Only allow service role key to execute arbitrary SQL
  if role <> 'service_role' then
    raise exception 'insufficient privileges for exec_sql()';
  end if;

  execute sql_query;
end;
$$;

-- Lock down permissions
revoke all on function public.exec_sql(text) from public;
grant execute on function public.exec_sql(text) to service_role;

comment on function public.exec_sql(text) is 'Execute arbitrary SQL; restricted to service_role via JWT claim check';


