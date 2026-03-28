-- Allow admins to insert products
create policy "Admins can insert products" on public.products
    for insert with check (public.is_admin());

-- Allow admins to update products
create policy "Admins can update products" on public.products
    for update using (public.is_admin());

-- Allow admins to delete products
create policy "Admins can delete products" on public.products
    for delete using (public.is_admin());
