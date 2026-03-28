-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create Products Table
create table if not exists products (
  id text primary key, -- Keeping text for now to match 'prod_...' format, or use uuid default gen_random_uuid()
  name text not null,
  description text,
  price numeric not null,
  category text,
  brand text,
  stock integer default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Wishlist Items Table
create table if not exists wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id text references products(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, product_id) -- Prevent duplicate wishlist items
);

-- 3. Enable RLS
alter table products enable row level security;
alter table wishlist_items enable row level security;

-- 4. RLS Policies for Products
-- Everyone can view products
create policy "Products are viewable by everyone" on products
  for select using (true);

-- Only admins can insert/update/delete products
-- (For now, we'll allow authenticated users with specific email to edit, or just leave it open for dev)
-- ideally: create policy "Admins can manage products" ...
-- For simplicity in this dev phase:
create policy "Authenticated users can manage products" on products
  for all using (auth.role() = 'authenticated'); 

-- 5. RLS Policies for Wishlist
-- Users can view their own wishlist
create policy "Users can view own wishlist" on wishlist_items
  for select using (auth.uid() = user_id);

-- Users can add to their own wishlist
create policy "Users can add to own wishlist" on wishlist_items
  for insert with check (auth.uid() = user_id);

-- Users can delete from their own wishlist
create policy "Users can delete from own wishlist" on wishlist_items
  for delete using (auth.uid() = user_id);

-- 6. Seed Data (Initial Products)
insert into products (id, name, category, price, stock, brand, description, image_url) values
('prod_1', 'High-Performance Gaming Laptop', 'Hardware', 25000, 15, 'TechMaster', 'Latest gen processor with RTX 4080', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1000'),
('prod_2', 'Wireless Noise-Cancelling Headphones', 'Accessories', 4500, 30, 'SoundPro', 'Premium sound quality with 30h battery life', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000'),
('prod_3', 'Mechanical Keyboard RGB', 'Peripherals', 1800, 50, 'ClickMech', 'Cherry MX Blue switches with customizable RGB', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1000'),
('prod_4', '4K Ultra HD Monitor 27"', 'Hardware', 8500, 10, 'ViewMax', 'IPS panel with 144Hz refresh rate', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000'),
('prod_5', 'Professional USB Microphone', 'Accessories', 2200, 25, 'AudioTech', 'Studio quality recording for streaming', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1000'),
('prod_6', 'Gaming Mouse Wireless', 'Peripherals', 1200, 40, 'SpeedGrip', '20000 DPI sensor with lightweight design', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000'),
('prod_7', 'External SSD 1TB', 'Storage', 1900, 60, 'FastDrive', 'USB-C 3.2 Gen 2 speeds', 'https://images.unsplash.com/photo-1597872250969-bc3a2d6398b8?auto=format&fit=crop&q=80&w=1000'),
('prod_8', 'Graphics Card RTX 4090', 'Hardware', 45000, 5, 'Nvidia', 'Ultimate gaming performance', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000'),
('prod_9', 'Smart Home Hub', 'Smart Home', 1500, 20, 'ConnectHome', 'Control all your devices from one place', 'https://images.unsplash.com/photo-1558002038-109177381795?auto=format&fit=crop&q=80&w=1000'),
('prod_10', 'Ergonomic Office Chair', 'Furniture', 5500, 12, 'ComfortSeating', 'Lumbar support and breathable mesh', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000')
on conflict (id) do nothing;
