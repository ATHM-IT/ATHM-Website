-- Replace the is_admin function to securely read from the user's JWT instead of crossing into the secure auth schema, which often blocks RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select (
    coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'email'), '') like '%@athm.com'
    or coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'email'), '') = 'admin@admin.com'
    or exists (
      select 1 from public.profiles
      where id = auth.uid()
      and is_admin = true
    )
  );
$$;

-- Ensure products actually have the permissive policies for admins just in case the last script was skipped or overridden
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

create policy "Admins can insert products" on public.products
    for insert with check (public.is_admin());

create policy "Admins can update products" on public.products
    for update using (public.is_admin());

create policy "Admins can delete products" on public.products
    for delete using (public.is_admin());
