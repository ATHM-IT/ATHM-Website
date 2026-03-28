-- 1. Add is_admin column to profiles
alter table profiles 
add column if not exists is_admin boolean default false;

-- 2. Create a function to check if the current user is an admin
-- This helper function makes policies cleaner
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and is_admin = true
  );
end;
$$ language plpgsql security definer;

-- 3. Update RLS on Products
-- First, ensure RLS is ENABLED (we disabled it earlier)
alter table products enable row level security;

-- Drop existing policies to start fresh
drop policy if exists "Authenticated users can manage products" on products;
drop policy if exists "Authenticated users can insert products" on products;
drop policy if exists "Authenticated users can update products" on products;
drop policy if exists "Authenticated users can delete products" on products;
drop policy if exists "Products are viewable by everyone" on products;

-- Public read access
create policy "Public read access" on products
  for select using (true);

-- Admin write access (using the is_admin() function)
create policy "Admin insert access" on products
  for insert with check (public.is_admin());

create policy "Admin update access" on products
  for update using (public.is_admin());

create policy "Admin delete access" on products
  for delete using (public.is_admin());

-- 4. Set current user as admin (OPTIONAL - Run this manually with your specific UUID if you know it, 
-- or generic update for the user who runs this script if they are in the auth table)
-- For now, let's make the user running this script an admin if possible, 
-- OR we can just rely on the user manually updating their profile row in Supabase dashboard.
-- Let's try to auto-set the first user as admin:
update profiles set is_admin = true 
where id in (select id from auth.users order by created_at asc limit 1);
