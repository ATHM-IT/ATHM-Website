-- Drop the potentially problematic "FOR ALL" policy
drop policy if exists "Authenticated users can manage products" on products;

-- Create explicit policies for each operation
-- Using "auth.uid() is not null" is a robust way to check if user is logged in
create policy "Authenticated users can insert products" on products
  for insert with check (auth.uid() is not null);

create policy "Authenticated users can update products" on products
  for update using (auth.uid() is not null);

create policy "Authenticated users can delete products" on products
  for delete using (auth.uid() is not null);

-- Ensure public read access is still there (if not, re-add it)
drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone" on products
  for select using (true);
