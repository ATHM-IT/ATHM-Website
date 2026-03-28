-- Add supplier tracking to products table
alter table public.products
add column if not exists supplier_id text;

-- Create Store Settings table for global markup
create table if not exists public.store_settings (
    id integer primary key,
    global_markup_percentage numeric not null default 20
);

-- Enable RLS on store_settings
alter table public.store_settings enable row level security;

-- Admin can manage store settings
create policy "Admins can manage store settings" on public.store_settings
    for all using (public.is_admin());

-- Everyone can view store settings (to calculate retail price)
create policy "Everyone can view store settings" on public.store_settings
    for select using (true);

-- Insert default settings row
insert into public.store_settings (id, global_markup_percentage)
values (1, 20)
on conflict (id) do nothing;
