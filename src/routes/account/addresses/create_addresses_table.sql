-- Create the addresses table
create table public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  street_line1 text not null,
  street_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'US',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.addresses enable row level security;

-- Create policies
create policy "Users can view their own addresses"
  on public.addresses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own addresses"
  on public.addresses for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own addresses"
  on public.addresses for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own addresses"
  on public.addresses for delete
  using ( auth.uid() = user_id );
