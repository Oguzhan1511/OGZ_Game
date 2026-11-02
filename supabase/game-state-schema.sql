-- Server-only game state. RPC operations are static SQL, never arbitrary queries.
create table public.ogz_game_rooms(code text primary key,data jsonb not null,version bigint not null default 0,created_at bigint not null);
create table public.ogz_game_listing_history(token text not null,listing_id text not null,room_code text not null,round_number integer not null,seen_at bigint,seen_count integer not null default 1,primary key(token,listing_id));
create index ogz_game_history_room on public.ogz_game_listing_history(room_code);
create table public.ogz_game_listing_reservations(token text not null,listing_id text not null,room_code text not null,expires_at bigint not null,primary key(token,listing_id));
create index ogz_game_reservations_room on public.ogz_game_listing_reservations(room_code);
create index ogz_game_reservations_expiry on public.ogz_game_listing_reservations(expires_at);
create table public.ogz_game_login_attempts(key text primary key,attempts integer not null,window_start bigint not null);
alter table public.ogz_game_rooms enable row level security;
alter table public.ogz_game_listing_history enable row level security;
alter table public.ogz_game_listing_reservations enable row level security;
alter table public.ogz_game_login_attempts enable row level security;
revoke all on public.ogz_game_rooms,public.ogz_game_listing_history,public.ogz_game_listing_reservations,public.ogz_game_login_attempts from anon,authenticated;
grant all on public.ogz_game_rooms,public.ogz_game_listing_history,public.ogz_game_listing_reservations,public.ogz_game_login_attempts to service_role;
create or replace function public.ogz_game_state(operations jsonb) returns jsonb language plpgsql security invoker set search_path=pg_catalog,public as $$
declare op jsonb;p jsonb;out jsonb:='[]';rows jsonb;affected bigint;expected bigint;current_version bigint;save_op jsonb;
begin
 if jsonb_typeof(operations)<>'array' or jsonb_array_length(operations)>100 or jsonb_array_length(operations)=0 then raise exception 'Invalid operations';end if;
 -- A row lock makes reservation/history writes and optimistic room updates one atomic unit.
 select value into save_op from jsonb_array_elements(operations) where value->>'op'='room_save' limit 1;
 if save_op is not null then
  expected:=(save_op->'params'->>2)::bigint;
  select version into current_version from public.ogz_game_rooms where code=save_op->'params'->>1 for update;
  if current_version is distinct from expected then
   select jsonb_agg(jsonb_build_object('results','[]'::jsonb,'meta',jsonb_build_object('changes',0))) into out from jsonb_array_elements(operations);return out;
  end if;
 end if;
 for op in select value from jsonb_array_elements(operations) loop
  p:=op->'params';rows:='[]';affected:=0;
  case op->>'op'
  when 'room_create' then
   insert into public.ogz_game_rooms(code,data,created_at) values(p->>0,(p->>1)::jsonb,(p->>2)::bigint) on conflict(code) do nothing;get diagnostics affected=row_count;
  when 'room_get' then
   select coalesce(jsonb_agg(to_jsonb(t)),'[]') into rows from (select data::text as data,version from public.ogz_game_rooms where code=p->>0) t;
  when 'room_save' then
   update public.ogz_game_rooms set data=(p->>0)::jsonb,version=version+1 where code=p->>1 and version=(p->>2)::bigint;get diagnostics affected=row_count;
  when 'legacy_listings' then null;
  when 'history_get' then
   select coalesce(jsonb_agg(to_jsonb(t)),'[]') into rows from (select listing_id,sum(seen_count) as seen_count,max(seen_at) as last_seen from public.ogz_game_listing_history where token in(select jsonb_array_elements_text(p)) group by listing_id) t;
  when 'reservations_get' then
   select coalesce(jsonb_agg(to_jsonb(t)),'[]') into rows from (select listing_id from public.ogz_game_listing_reservations where token in(select jsonb_array_elements_text(p))) t;
  when 'reservations_expire' then
   delete from public.ogz_game_listing_reservations where expires_at<=(p->>0)::bigint;get diagnostics affected=row_count;
  when 'reserve' then
   insert into public.ogz_game_listing_reservations(token,listing_id,room_code,expires_at) select p->>0,value->>'id',p->>1,(p->>2)::bigint from jsonb_array_elements((p->>3)::jsonb) where exists(select 1 from public.ogz_game_rooms where code=p->>4 and version=(p->>5)::bigint);get diagnostics affected=row_count;
  when 'history_mark' then
   insert into public.ogz_game_listing_history(token,listing_id,room_code,round_number,seen_at,seen_count) select p->>0,p->>1,p->>2,(p->>3)::integer,(p->>4)::bigint,1 where exists(select 1 from public.ogz_game_rooms where code=p->>5 and version=(p->>6)::bigint) on conflict(token,listing_id) do update set room_code=excluded.room_code,round_number=excluded.round_number,seen_at=excluded.seen_at,seen_count=ogz_game_listing_history.seen_count+1;get diagnostics affected=row_count;
  when 'release_room' then
   delete from public.ogz_game_listing_reservations where room_code=p->>0 and exists(select 1 from public.ogz_game_rooms where code=p->>1 and version=(p->>2)::bigint);get diagnostics affected=row_count;
  when 'release_player' then
   delete from public.ogz_game_listing_reservations where room_code=p->>0 and token=p->>1 and exists(select 1 from public.ogz_game_rooms where code=p->>2 and version=(p->>3)::bigint);get diagnostics affected=row_count;
  when 'login_reset' then
   delete from public.ogz_game_login_attempts where key=p->>0;get diagnostics affected=row_count;
  when 'login_attempt' then
   insert into public.ogz_game_login_attempts(key,attempts,window_start) values(p->>0,1,(p->>1)::bigint) on conflict(key) do update set attempts=case when ogz_game_login_attempts.window_start<=(p->>2)::bigint then 1 else ogz_game_login_attempts.attempts+1 end,window_start=case when ogz_game_login_attempts.window_start<=(p->>3)::bigint then excluded.window_start else ogz_game_login_attempts.window_start end;get diagnostics affected=row_count;
  when 'login_get' then
   select coalesce(jsonb_agg(to_jsonb(t)),'[]') into rows from (select attempts from public.ogz_game_login_attempts where key=p->>0) t;
  else raise exception 'Unknown operation';end case;
  out:=out||jsonb_build_array(jsonb_build_object('results',rows,'meta',jsonb_build_object('changes',affected)));
 end loop;return out;
end $$;
revoke all on function public.ogz_game_state(jsonb) from public,anon,authenticated;
grant execute on function public.ogz_game_state(jsonb) to service_role;
create or replace function public.ogz_game_import_state(table_name text,items jsonb) returns bigint language plpgsql security invoker set search_path=pg_catalog,public as $$
declare affected bigint;
begin
 if jsonb_typeof(items)<>'array' or jsonb_array_length(items)>500 then raise exception 'Invalid import';end if;
 case table_name
 when 'rooms' then insert into public.ogz_game_rooms(code,data,version,created_at) select x->>'code',case when jsonb_typeof(x->'data')='string' then (x->>'data')::jsonb else x->'data' end,(x->>'version')::bigint,(x->>'created_at')::bigint from jsonb_array_elements(items) x on conflict(code) do update set data=excluded.data,version=excluded.version,created_at=excluded.created_at;
 when 'listing_history' then insert into public.ogz_game_listing_history(token,listing_id,room_code,round_number,seen_at,seen_count) select x->>'token',x->>'listing_id',x->>'room_code',(x->>'round_number')::integer,(x->>'seen_at')::bigint,(x->>'seen_count')::integer from jsonb_array_elements(items) x on conflict(token,listing_id) do update set room_code=excluded.room_code,round_number=excluded.round_number,seen_at=excluded.seen_at,seen_count=excluded.seen_count;
 when 'listing_reservations' then insert into public.ogz_game_listing_reservations(token,listing_id,room_code,expires_at) select x->>'token',x->>'listing_id',x->>'room_code',(x->>'expires_at')::bigint from jsonb_array_elements(items) x on conflict(token,listing_id) do update set room_code=excluded.room_code,expires_at=excluded.expires_at;
 when 'admin_login_attempts' then insert into public.ogz_game_login_attempts(key,attempts,window_start) select x->>'key',(x->>'attempts')::integer,(x->>'window_start')::bigint from jsonb_array_elements(items) x on conflict(key) do update set attempts=excluded.attempts,window_start=excluded.window_start;
 else raise exception 'Invalid import table';end case;get diagnostics affected=row_count;return affected;
end $$;
revoke all on function public.ogz_game_import_state(text,jsonb) from public,anon,authenticated;
grant execute on function public.ogz_game_import_state(text,jsonb) to service_role;
