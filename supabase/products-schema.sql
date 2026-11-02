-- Applied remotely using Supabase apply_migration: create_ogz_game_products.
create table if not exists public.ogz_game_products (
 id text primary key,
 data jsonb not null,
 created_at bigint not null,
 constraint product_id_matches check (data->>'id'=id),
 constraint valid_product_price check ((data->>'price')::numeric > 0)
);
alter table public.ogz_game_products enable row level security;
revoke all on public.ogz_game_products from anon, authenticated;
grant all on public.ogz_game_products to service_role;
create index if not exists ogz_game_products_created on public.ogz_game_products(created_at desc,id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('ogz-game','ogz-game',true,5000000,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
