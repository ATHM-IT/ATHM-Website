-- Temporarily disable RLS on orders and order_items to verify data exists
alter table orders disable row level security;
alter table order_items disable row level security;
