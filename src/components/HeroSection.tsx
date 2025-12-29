import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/language-context';
import { seedScholarships } from '@/lib/scholarships';
import { 
  Search, 
  Star,
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  Shield
} from 'lucide-react';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t, isUrdu } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="relative hero-gradient py-24 md:py-36 overflow-hidden">
      {/* Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 islamic-pattern" />
      <div className="absolute inset-0 network-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 start-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 end-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 start-1/4 h-40 w-40 rounded-full bg-accent/5 blur-2xl animate-pulse-soft" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">

        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm text-accent px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in border border-accent/30">
            <Star className="h-4 w-4" />
            <span>{t('hero.badge')}</span>
            <Shield className="h-4 w-4" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight animate-slide-up font-display">
            {t('hero.title1')}
            <br />
            <span className="text-accent">{t('hero.title2')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-12 leading-relaxed animate-slide-up stagger-1 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="animate-slide-up stagger-2">
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className={`absolute ${isUrdu ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                <Input
                  type="text"
                  placeholder={t('hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isUrdu ? 'pr-12' : 'pl-12'} h-14 text-base bg-white border-0 shadow-medium rounded-xl`}
                />
              </div>
              <Button type="submit" size="lg" variant="gold" className="h-14 px-8 rounded-xl font-semibold">
                {t('hero.searchButton')}
                <ArrowRight className={`h-5 w-5 ${isUrdu ? 'me-1 rotate-180' : 'ms-1'}`} />
              </Button>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-slide-up stagger-3">
            <div className="flex items-center gap-2 text-white/70 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
              <Shield className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{isUrdu ? 'تصدیق شدہ اسکالرشپس' : 'Verified Scholarships'}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{isUrdu ? 'مفت رجسٹریشن' : 'Free Registration'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}