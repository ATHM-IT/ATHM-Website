-- Update is_admin function to include email check
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and is_admin = true
  ) OR exists (
    select 1 from auth.users
    where id = auth.uid()
    and (email like '%@athm.com' or email = 'admin@admin.com')
  );
end;
$$ language plpgsql security definer;
