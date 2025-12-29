import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isUrdu: boolean;
}

const translations = {
  en: {
    // Header
    'nav.scholarships': 'All Scholarships',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.getStarted': 'Get Started',
    'nav.logout': 'Logout',
    
    // Hero
    'hero.badge': "Pakistan's #1 Scholarship Portal",
    'hero.title1': 'Your Path to',
    'hero.title2': 'Educational Excellence',
    'hero.subtitle': 'Discover scholarships tailored to your profile. We bridge the information gap so you never miss an opportunity.',
    'hero.searchPlaceholder': 'Search scholarships (HEC, Fulbright, PEEF...)',
    'hero.searchButton': 'Find Scholarships',
    'hero.stat1': 'Scholarships',
    'hero.stat2': 'All Provinces',
    'hero.stat3': '100% Free',
    
    // Categories
    'categories.title': 'Browse by Category',
    'categories.subtitle': 'Explore scholarships organized by type. Each category is designed to help you find opportunities that match your situation.',
    'category.international': 'International',
    'category.international.desc': 'Study abroad opportunities including Fulbright, Chevening, and more.',
    'category.needBased': 'Need-Based',
    'category.needBased.desc': 'Financial aid for students from low-income families.',
    'category.merit': 'Merit-Based',
    'category.merit.desc': 'Rewards for academic excellence and achievements.',
    'category.special': 'Special Quota',
    'category.special.desc': 'Dedicated programs for orphans, disabled students, and minorities.',
    'category.available': 'available',
    
    // How It Works
    'howItWorks.title': 'How Sahulat-e-Taleem Works',
    'howItWorks.subtitle': 'Our intelligent matching engine connects you with scholarships you actually qualify for.',
    'howItWorks.step1.title': 'Create Your Profile',
    'howItWorks.step1.desc': 'Enter your academic details, province, GPA, and family income during registration.',
    'howItWorks.step2.title': 'Get Matched',
    'howItWorks.step2.desc': 'Our algorithm filters scholarships based on your eligibility criteria automatically.',
    'howItWorks.step3.title': 'Apply & Succeed',
    'howItWorks.step3.desc': 'Access direct links to official scholarship portals and never miss a deadline.',
    
    // CTA
    'cta.title': "Don't Miss Your Opportunity",
    'cta.subtitle': 'Create your free account today and get personalized scholarship recommendations based on your profile.',
    'cta.button': 'Create Free Account',
    'cta.browseButton': 'Browse Scholarships',
    
    // Footer
    'footer.description': 'Bridging the information gap for Pakistani students. Find scholarships that match your profile and secure your educational future.',
    'footer.quickLinks': 'Quick Links',
    'footer.categories': 'Categories',
    'footer.createAccount': 'Create Account',
    'footer.signIn': 'Sign In',
    'footer.copyright': '© 2025 Sahulat-e-Taleem. All rights reserved.',
    'footer.madeWith': 'Made with',
    'footer.forStudents': 'for Pakistani students',
    
    // Scholarships Page
    'scholarships.title': 'Find Your Scholarship',
    'scholarships.filters': 'Filters',
    'scholarships.category': 'Category',
    'scholarships.all': 'All',
    'scholarships.deadline': 'Deadline',
    'scholarships.amount': 'Amount',
    'scholarships.applyNow': 'Apply Now',
    'scholarships.daysLeft': 'days left',
    'scholarships.expired': 'Expired',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.welcomeBack': 'Welcome Back',
    'auth.loginSubtitle': 'Enter your credentials to access your dashboard',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.createAccount': 'Create Account',
    'auth.joinUs': 'Join Sahulat-e-Taleem',
    'auth.registerSubtitle': 'Create your profile to get personalized scholarship matches',
    
    // Dashboard
    'dashboard.title': 'Your Dashboard',
    'dashboard.recommended': 'Recommended for You',
    'dashboard.noMatch': 'No scholarships match your profile criteria at this time.',
    'dashboard.profile': 'Your Profile',
    
    // Common
    'common.learnMore': 'Learn More',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
  },
  ur: {
    // Header
    'nav.scholarships': 'تمام وظائف',
    'nav.dashboard': 'ڈیش بورڈ',
    'nav.admin': 'ایڈمن',
    'nav.login': 'لاگ ان',
    'nav.getStarted': 'شروع کریں',
    'nav.logout': 'لاگ آؤٹ',
    
    // Hero
    'hero.badge': 'پاکستان کا نمبر ۱ وظائف پورٹل',
    'hero.title1': 'تعلیمی کامیابی',
    'hero.title2': 'کی راہ',
    'hero.subtitle': 'اپنی پروفائل کے مطابق وظائف تلاش کریں۔ ہم معلومات کے فرق کو پُر کرتے ہیں تاکہ آپ کوئی موقع نہ کھوئیں۔',
    'hero.searchPlaceholder': 'وظائف تلاش کریں (HEC، فل برائٹ، PEEF...)',
    'hero.searchButton': 'وظائف تلاش کریں',
    'hero.stat1': 'وظائف',
    'hero.stat2': 'تمام صوبے',
    'hero.stat3': 'بالکل مفت',
    
    // Categories
    'categories.title': 'زمرے کے مطابق تلاش کریں',
    'categories.subtitle': 'قسم کے مطابق ترتیب دیے گئے وظائف دیکھیں۔ ہر زمرہ آپ کی صورتحال سے مماثل مواقع تلاش کرنے میں مدد کرتا ہے۔',
    'category.international': 'بین الاقوامی',
    'category.international.desc': 'بیرون ملک تعلیم کے مواقع جن میں فل برائٹ، شیوننگ اور بہت کچھ شامل ہے۔',
    'category.needBased': 'ضرورت کی بنیاد پر',
    'category.needBased.desc': 'کم آمدنی والے خاندانوں کے طلباء کے لیے مالی امداد۔',
    'category.merit': 'میرٹ کی بنیاد پر',
    'category.merit.desc': 'تعلیمی کارکردگی اور کامیابیوں کے لیے انعامات۔',
    'category.special': 'خصوصی کوٹہ',
    'category.special.desc': 'یتیموں، معذور طلباء اور اقلیتوں کے لیے مخصوص پروگرام۔',
    'category.available': 'دستیاب',
    
    // How It Works
    'howItWorks.title': 'سہولت تعلیم کیسے کام کرتی ہے',
    'howItWorks.subtitle': 'ہمارا ذہین میچنگ انجن آپ کو ان وظائف سے جوڑتا ہے جن کے لیے آپ واقعی اہل ہیں۔',
    'howItWorks.step1.title': 'اپنی پروفائل بنائیں',
    'howItWorks.step1.desc': 'رجسٹریشن کے دوران اپنی تعلیمی تفصیلات، صوبہ، GPA اور خاندانی آمدنی درج کریں۔',
    'howItWorks.step2.title': 'میچ حاصل کریں',
    'howItWorks.step2.desc': 'ہمارا الگورتھم آپ کی اہلیت کے معیار کی بنیاد پر وظائف کو خودکار طریقے سے فلٹر کرتا ہے۔',
    'howItWorks.step3.title': 'درخواست دیں اور کامیاب ہوں',
    'howItWorks.step3.desc': 'سرکاری وظائف پورٹلز کے براہ راست لنکس تک رسائی حاصل کریں اور کوئی ڈیڈ لائن مت چوکیں۔',
    
    // CTA
    'cta.title': 'اپنا موقع نہ کھوئیں',
    'cta.subtitle': 'آج ہی اپنا مفت اکاؤنٹ بنائیں اور اپنی پروفائل کی بنیاد پر ذاتی وظائف کی سفارشات حاصل کریں۔',
    'cta.button': 'مفت اکاؤنٹ بنائیں',
    'cta.browseButton': 'وظائف دیکھیں',
    
    // Footer
    'footer.description': 'پاکستانی طلباء کے لیے معلومات کے فرق کو پُر کرنا۔ اپنی پروفائل سے مماثل وظائف تلاش کریں اور اپنے تعلیمی مستقبل کو محفوظ بنائیں۔',
    'footer.quickLinks': 'فوری لنکس',
    'footer.categories': 'زمرے',
    'footer.createAccount': 'اکاؤنٹ بنائیں',
    'footer.signIn': 'سائن ان',
    'footer.copyright': '© 2025 سہولت تعلیم۔ جملہ حقوق محفوظ ہیں۔',
    'footer.madeWith': 'بنایا گیا',
    'footer.forStudents': 'پاکستانی طلباء کے لیے',
    
    // Scholarships Page
    'scholarships.title': 'اپنا وظیفہ تلاش کریں',
    'scholarships.filters': 'فلٹرز',
    'scholarships.category': 'زمرہ',
    'scholarships.all': 'تمام',
    'scholarships.deadline': 'آخری تاریخ',
    'scholarships.amount': 'رقم',
    'scholarships.applyNow': 'ابھی درخواست دیں',
    'scholarships.daysLeft': 'دن باقی',
    'scholarships.expired': 'ختم ہو گیا',
    
    // Auth
    'auth.login': 'لاگ ان',
    'auth.register': 'رجسٹر',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.name': 'پورا نام',
    'auth.welcomeBack': 'خوش آمدید',
    'auth.loginSubtitle': 'اپنے ڈیش بورڈ تک رسائی کے لیے اپنی تفصیلات درج کریں',
    'auth.noAccount': 'اکاؤنٹ نہیں ہے؟',
    'auth.hasAccount': 'پہلے سے اکاؤنٹ ہے؟',
    'auth.createAccount': 'اکاؤنٹ بنائیں',
    'auth.joinUs': 'سہولت تعلیم میں شامل ہوں',
    'auth.registerSubtitle': 'ذاتی وظائف میچز حاصل کرنے کے لیے اپنی پروفائل بنائیں',
    
    // Dashboard
    'dashboard.title': 'آپ کا ڈیش بورڈ',
    'dashboard.recommended': 'آپ کے لیے تجویز کردہ',
    'dashboard.noMatch': 'اس وقت کوئی وظیفہ آپ کی پروفائل سے میل نہیں کھاتا۔',
    'dashboard.profile': 'آپ کی پروفائل',
    
    // Common
    'common.learnMore': 'مزید جانیں',
    'common.viewAll': 'سب دیکھیں',
    'common.loading': 'لوڈ ہو رہا ہے...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sahulat_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isUrdu: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
