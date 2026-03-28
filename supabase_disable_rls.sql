-- TEMPORARY FIX: Disable RLS on products table
-- This will confirm if the issue is purely the policy/context
alter table products disable row level security;
