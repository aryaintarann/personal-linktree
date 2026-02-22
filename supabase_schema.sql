-- supabase_schema.sql
-- Create Profiles Table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  bio text,
  avatar_url text,
  theme text DEFAULT 'light'
);

-- Create Links Table
CREATE TABLE public.links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  icon_name text, -- Name of the Lucide icon, e.g., 'briefcase', 'github'
  icon_color text, -- Optional custom hex wrapper color or Tailwind class
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Socials Table
CREATE TABLE public.socials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL, -- e.g., 'instagram', 'twitter', 'github'
  url text NOT NULL,
  order_index integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for Links
CREATE POLICY "Public links are viewable by everyone." ON public.links FOR SELECT USING (true);
CREATE POLICY "Users can insert their own links." ON public.links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own links." ON public.links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own links." ON public.links FOR DELETE USING (auth.uid() = user_id);

-- Policies for Socials
CREATE POLICY "Public socials are viewable by everyone." ON public.socials FOR SELECT USING (true);
CREATE POLICY "Users can insert their own socials." ON public.socials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own socials." ON public.socials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own socials." ON public.socials FOR DELETE USING (auth.uid() = user_id);
