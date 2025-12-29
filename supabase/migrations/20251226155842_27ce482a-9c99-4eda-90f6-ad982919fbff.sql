-- Create scholarships table
CREATE TABLE public.scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    deadline DATE NOT NULL,
    amount TEXT NOT NULL,
    official_link TEXT NOT NULL,
    provider_homepage TEXT NOT NULL,
    min_gpa NUMERIC(2,1) NOT NULL DEFAULT 2.0,
    max_income INTEGER NOT NULL DEFAULT 50000,
    allowed_provinces TEXT[] NOT NULL DEFAULT ARRAY['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    is_international BOOLEAN NOT NULL DEFAULT false,
    is_zakat_eligible BOOLEAN NOT NULL DEFAULT false,
    is_orphan_quota BOOLEAN NOT NULL DEFAULT false,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'need-based' CHECK (category IN ('international', 'need-based', 'merit', 'special')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Public can view all scholarships (read-only for everyone)
CREATE POLICY "Anyone can view scholarships"
ON public.scholarships
FOR SELECT
USING (true);

-- Only admins can insert scholarships
CREATE POLICY "Admins can insert scholarships"
ON public.scholarships
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update scholarships
CREATE POLICY "Admins can update scholarships"
ON public.scholarships
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete scholarships
CREATE POLICY "Admins can delete scholarships"
ON public.scholarships
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_scholarships_updated_at
BEFORE UPDATE ON public.scholarships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();