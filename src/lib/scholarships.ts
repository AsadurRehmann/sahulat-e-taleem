export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: Date;
  amount: string;
  officialLink: string;
  providerHomepage: string; // Fallback URL for the provider's main website
  minGPA: number;
  maxIncome: number;
  allowedProvinces: string[];
  isInternational: boolean;
  isZakatEligible: boolean;
  isOrphanQuota: boolean;
  description: string;
  category: 'international' | 'need-based' | 'merit' | 'special';
}

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

export const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Kashmir',
  'Islamabad Capital Territory',
] as const;

export const DEGREES = [
  'Matriculation',
  'Intermediate',
  'Bachelor\'s',
  'Master\'s',
  'PhD',
] as const;

// Seed data - 15 real Pakistani scholarships for 2025-26
export const seedScholarships: Scholarship[] = [
  {
    id: '1',
    title: 'HEC Need-Based Scholarship 2025',
    provider: 'Higher Education Commission (HEC)',
    deadline: new Date('2026-03-15'),
    amount: 'PKR 50,000 - 150,000 per semester',
    officialLink: 'https://hec.gov.pk/english/scholarshipsgrants',
    providerHomepage: 'https://hec.gov.pk',
    minGPA: 2.0,
    maxIncome: 45000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Financial assistance for undergraduate students from low-income families pursuing higher education at public sector universities across Pakistan.',
    category: 'need-based',
  },
  {
    id: '2',
    title: 'PEEF Master Level Scholarship',
    provider: 'Punjab Educational Endowment Fund (PEEF)',
    deadline: new Date('2026-02-28'),
    amount: 'Full tuition + PKR 10,000/month stipend',
    officialLink: 'https://peef.org.pk',
    providerHomepage: 'https://peef.org.pk',
    minGPA: 2.4,
    maxIncome: 60000,
    allowedProvinces: ['Punjab'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Scholarship for Punjab domicile students pursuing Master\'s degree programs at recognized universities with strong academic record.',
    category: 'merit',
  },
  {
    id: '3',
    title: 'PEEF Special Quota (Orphans)',
    provider: 'Punjab Educational Endowment Fund (PEEF)',
    deadline: new Date('2026-01-10'),
    amount: 'Full tuition + PKR 8,000/month stipend',
    officialLink: 'https://peef.org.pk',
    providerHomepage: 'https://peef.org.pk',
    minGPA: 2.4,
    maxIncome: 100000,
    allowedProvinces: ['Punjab'],
    isInternational: false,
    isZakatEligible: true,
    isOrphanQuota: true,
    description: 'Special quota scholarship exclusively for orphan students from Punjab province to pursue undergraduate and postgraduate education.',
    category: 'special',
  },
  {
    id: '4',
    title: 'Stipendium Hungaricum 2026',
    provider: 'Government of Hungary',
    deadline: new Date('2026-01-15'),
    amount: 'Full funding (tuition, living, health insurance)',
    officialLink: 'https://stipendiumhungaricum.hu',
    providerHomepage: 'https://stipendiumhungaricum.hu',
    minGPA: 3.0,
    maxIncome: 500000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: true,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Fully-funded scholarship by the Hungarian Government for Pakistani students to study Bachelor\'s, Master\'s, or PhD programs at Hungarian universities.',
    category: 'international',
  },
  {
    id: '5',
    title: 'Chief Minister Honhaar Scholarship',
    provider: 'Government of Punjab',
    deadline: new Date('2026-04-30'),
    amount: 'PKR 50,000 - 200,000 per year',
    officialLink: 'https://punjab.gov.pk/scholarships',
    providerHomepage: 'https://punjab.gov.pk',
    minGPA: 2.5,
    maxIncome: 80000,
    allowedProvinces: ['Punjab'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Large-scale scholarship program with 30,000 slots for talented undergraduate students from Punjab to pursue higher education.',
    category: 'merit',
  },
  {
    id: '6',
    title: 'BEEF Fully Funded Scholarship',
    provider: 'Balochistan Educational Endowment Fund (BEEF)',
    deadline: new Date('2026-03-01'),
    amount: 'Full tuition + monthly stipend',
    officialLink: 'https://beef.org.pk/',
    providerHomepage: 'https://beef.org.pk/',
    minGPA: 3.0,
    maxIncome: 150000,
    allowedProvinces: ['Balochistan'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Merit-based fully funded scholarship for Balochistan domicile students pursuing higher education at recognized universities.',
    category: 'merit',
  },
  {
    id: '7',
    title: 'Scotland Pakistan Scholarship (Females)',
    provider: 'British Council Pakistan',
    deadline: new Date('2026-02-15'),
    amount: 'Full funding (tuition, living, travel)',
    officialLink: 'https://www.britishcouncil.pk/scholarships',
    providerHomepage: 'https://www.britishcouncil.pk/',
    minGPA: 3.2,
    maxIncome: 200000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: true,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Fully-funded scholarship for Pakistani women to pursue Master\'s degrees in STEM, Education, or Health sectors at Scottish universities.',
    category: 'international',
  },
  {
    id: '8',
    title: 'Ihsan Trust Qarz-e-Hasna Program',
    provider: 'Ihsan Trust',
    deadline: new Date('2026-04-10'),
    amount: 'Interest-free loan up to PKR 500,000',
    officialLink: 'https://ihsantrust.org',
    providerHomepage: 'https://ihsantrust.org',
    minGPA: 2.0,
    maxIncome: 40000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: true,
    isOrphanQuota: false,
    description: 'Shariah-compliant interest-free education loan for Zakat-eligible students from all provinces to complete their education.',
    category: 'need-based',
  },
  {
    id: '9',
    title: 'Sindh Educational Endowment Fund (SEEF)',
    provider: 'Government of Sindh',
    deadline: new Date('2025-12-30'),
    amount: 'PKR 40,000 - 100,000 per year',
    officialLink: 'https://seef.sindh.gov.pk/',
    providerHomepage: 'https://seef.sindh.gov.pk/',
    minGPA: 2.5,
    maxIncome: 50000,
    allowedProvinces: ['Sindh'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Financial support for Sindh domicile students pursuing undergraduate and postgraduate studies at recognized institutions.',
    category: 'need-based',
  },
  {
    id: '10',
    title: 'USAID Merit & Need-Based Scholarship',
    provider: 'United States Agency for International Development',
    deadline: new Date('2026-05-15'),
    amount: 'Full tuition + living allowance',
    officialLink: 'https://www.hec.gov.pk/english/scholarshipsgrants/USAID-NeedsBased/',
    providerHomepage: 'https://www.hec.gov.pk/',
    minGPA: 2.8,
    maxIncome: 60000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Combined merit and need-based scholarship for Pakistani undergraduate students demonstrating academic excellence and financial need.',
    category: 'need-based',
  },
  {
    id: '11',
    title: 'Chinese Government Scholarship 2026',
    provider: 'China Scholarship Council (CSC)',
    deadline: new Date('2026-02-28'),
    amount: 'Full funding (tuition, accommodation, stipend)',
    officialLink: 'https://www.campuschina.org',
    providerHomepage: 'https://www.campuschina.org',
    minGPA: 3.5,
    maxIncome: 500000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: true,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Prestigious fully-funded scholarship for Pakistani students to pursue Master\'s and PhD programs at top Chinese universities.',
    category: 'international',
  },
  {
    id: '12',
    title: 'Dalda Foundation Scholarship',
    provider: 'Dalda Foundation',
    deadline: new Date('2026-01-31'),
    amount: 'PKR 25,000 - 50,000 per year',
    officialLink: 'https://daldafoundation.pk/',
    providerHomepage: 'https://daldafoundation.pk/',
    minGPA: 2.5,
    maxIncome: 35000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Financial assistance for intermediate level students from all over Pakistan to continue their education journey.',
    category: 'need-based',
  },
  {
    id: '13',
    title: 'Fauji Foundation Excellence Award',
    provider: 'Fauji Foundation',
    deadline: new Date('2026-03-15'),
    amount: 'Full tuition + PKR 15,000/month stipend',
    officialLink: 'https://fauji.org.pk/welfare/education',
    providerHomepage: 'https://fauji.org.pk/',
    minGPA: 3.0,
    maxIncome: 100000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Excellence award for children of retired and serving army personnel pursuing higher education at recognized institutions.',
    category: 'special',
  },
  {
    id: '14',
    title: 'Nestlé Females in STEM Scholarship',
    provider: 'Nestlé Pakistan',
    deadline: new Date('2026-02-01'),
    amount: 'PKR 100,000 per year + internship opportunity',
    officialLink: 'https://www.nestle.pk/csv/communities/education',
    providerHomepage: 'https://www.nestle.pk/',
    minGPA: 3.2,
    maxIncome: 80000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: false,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Scholarship specifically for female students pursuing Engineering and Science degrees at recognized Pakistani universities.',
    category: 'merit',
  },
  {
    id: '15',
    title: 'Commonwealth Scholarships 2026',
    provider: 'Commonwealth Scholarship Commission (UK)',
    deadline: new Date('2026-01-10'),
    amount: 'Full funding (tuition, living, travel, thesis grant)',
    officialLink: 'https://cscuk.fcdo.gov.uk/scholarships',
    providerHomepage: 'https://cscuk.fcdo.gov.uk/',
    minGPA: 3.5,
    maxIncome: 500000,
    allowedProvinces: ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir', 'Islamabad Capital Territory'],
    isInternational: true,
    isZakatEligible: false,
    isOrphanQuota: false,
    description: 'Prestigious fully-funded scholarship for Pakistani students to pursue Master\'s and PhD programs at UK universities.',
    category: 'international',
  },
];

// Matching engine - filters scholarships based on user profile
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
