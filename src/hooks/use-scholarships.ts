import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbScholarship {
  id: string;
  title: string;
  provider: string;
  deadline: string;
  amount: string;
  official_link: string;
  provider_homepage: string;
  min_gpa: number;
  max_income: number;
  allowed_provinces: string[];
  is_international: boolean;
  is_zakat_eligible: boolean;
  is_orphan_quota: boolean;
  description: string;
  category: string;
  status: string;
}

// Convert DB scholarship to frontend format
export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: Date;
  amount: string;
  officialLink: string;
  providerHomepage: string;
  minGPA: number;
  maxIncome: number;
  allowedProvinces: string[];
  isInternational: boolean;
  isZakatEligible: boolean;
  isOrphanQuota: boolean;
  description: string;
  category: string;
  status: string;
}

export function convertDbToFrontend(db: DbScholarship): Scholarship {
  return {
    id: db.id,
    title: db.title,
    provider: db.provider,
    deadline: new Date(db.deadline),
    amount: db.amount,
    officialLink: db.official_link,
    providerHomepage: db.provider_homepage,
    minGPA: db.min_gpa,
    maxIncome: db.max_income,
    allowedProvinces: db.allowed_provinces,
    isInternational: db.is_international,
    isZakatEligible: db.is_zakat_eligible,
    isOrphanQuota: db.is_orphan_quota,
    description: db.description,
    category: db.category,
    status: db.status,
  };
}

export function useScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('status', 'active')
        .order('deadline', { ascending: true });
      
      if (error) {
        setError(error.message);
        setScholarships([]);
      } else {
        const converted = (data || []).map(convertDbToFrontend);
        setScholarships(converted);
        setError(null);
      }
      setLoading(false);
    };

    fetchScholarships();
  }, []);

  return { scholarships, loading, error };
}

// Matching engine - filters scholarships based on user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  province: string;
  currentDegree: string;
  gpa: number;
  familyIncome: number;
  isOrphan: boolean;
  isZakatEligible: boolean;
}

export function getMatchingScholarships(
  scholarships: Scholarship[],
  userProfile: UserProfile
): Scholarship[] {
  return scholarships.filter((scholarship) => {
    // GPA requirement
    if (userProfile.gpa < scholarship.minGPA) return false;
    
    // Income requirement
    if (userProfile.familyIncome > scholarship.maxIncome) return false;
    
    // Province requirement
    if (!scholarship.allowedProvinces.includes(userProfile.province)) return false;
    
    // Zakat eligibility (if scholarship requires it)
    if (scholarship.isZakatEligible && !userProfile.isZakatEligible) return false;
    
    // Orphan quota (if scholarship requires it)
    if (scholarship.isOrphanQuota && !userProfile.isOrphan) return false;
    
    return true;
  });
}

// Get days until deadline
export function getDaysUntilDeadline(deadline: Date): number {
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Check if deadline is urgent (within 7 days)
export function isDeadlineUrgent(deadline: Date): boolean {
  return getDaysUntilDeadline(deadline) <= 7;
}

// Check if deadline is within 14 days (warning)
export function isDeadlineWarning(deadline: Date): boolean {
  const days = getDaysUntilDeadline(deadline);
  return days > 7 && days <= 14;
}