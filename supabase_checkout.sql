-- 1. Create Orders Table
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  status text not null default 'pending', -- pending, paid, shipped, delivered, cancelled
  total_amount numeric not null,
  shipping_address jsonb not null, -- Stores { line1, city, postal_code, country }
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Order Items Table
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) not null,
  product_id text references products(id) not null,
  quantity integer not null default 1,
  price_at_purchase numeric not null, -- Store price at time of purchase in case product price changes later
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. RLS for Orders
alter table orders enable row level security;
alter table order_items enable row level security;

-- Users can view their own orders
create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

-- Users can create their own orders
create policy "Users can create own orders" on orders
  for insert with check (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders" on orders
  for select using (public.is_admin());

-- Admins can update orders (e.g. status)
create policy "Admins can update orders" on orders
  for update using (public.is_admin());

-- 4. RLS for Order Items
-- Users can view their own order items (via the order relationship)
create policy "Users can view own order items" on order_items
  for select using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Users can create order items (usually done at same time as order)
create policy "Users can create order items" on order_items
  for insert with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
create policy "Admins can view all order items" on order_items
  for select using (public.is_admin());
