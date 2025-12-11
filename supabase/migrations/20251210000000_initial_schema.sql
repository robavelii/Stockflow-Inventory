-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  sku text not null,
  category text not null,
  quantity integer not null default 0,
  min_level integer not null default 10,
  price numeric not null default 0,
  cost numeric not null default 0,
  status text not null,
  supplier text not null,
  updated_at timestamptz default now()
);

-- Orders Table
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  customer_name text not null,
  total numeric not null default 0,
  status text not null,
  items_count integer not null default 0,
  created_at timestamptz default now()
);

-- User Preferences Table
create table public.user_preferences (
  user_id uuid primary key references auth.users not null,
  dark_mode boolean default false,
  email_notifications boolean default true,
  push_notifications boolean default false,
  currency text default 'USD'
);

-- Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.user_preferences enable row level security;

-- Policies for Products
create policy "Users can view their own products"
  on public.products for select
  using (auth.uid() = user_id);

create policy "Users can insert their own products"
  on public.products for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own products"
  on public.products for update
  using (auth.uid() = user_id);

create policy "Users can delete their own products"
  on public.products for delete
  using (auth.uid() = user_id);

-- Policies for Orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id);

-- Policies for User Preferences
create policy "Users can view their own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
  on public.user_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);
