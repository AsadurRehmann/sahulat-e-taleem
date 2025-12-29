import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { CategoryTile } from '@/components/CategoryTile';
import { Button } from '@/components/ui/button';
import { seedScholarships } from '@/lib/scholarships';
import { useLanguage } from '@/lib/language-context';
import { 
  Globe, 
  Heart, 
  Trophy, 
  Star,
  GraduationCap,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { t, isUrdu } = useLanguage();

  // Count scholarships by category
  const internationalCount = seedScholarships.filter(s => s.isInternational).length;
  const needBasedCount = seedScholarships.filter(s => s.category === 'need-based').length;
  const meritCount = seedScholarships.filter(s => s.category === 'merit').length;
  const specialCount = seedScholarships.filter(s => s.category === 'special').length;

  const steps = [
    {
      step: '1',
      icon: <Users className="h-7 w-7" />,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
    },
    {
      step: '2',
      icon: <Target className="h-7 w-7" />,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
    },
    {
      step: '3',
      icon: <GraduationCap className="h-7 w-7" />,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight font-display">
                {t('categories.title')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('categories.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryTile
                title={t('category.international')}
                description={t('category.international.desc')}
                icon={<Globe className="h-7 w-7" />}
                to="/scholarships?category=international"
                count={internationalCount}
                gradient="bg-gradient-to-br from-blue-600 to-indigo-700"
              />
              <CategoryTile
                title={t('category.needBased')}
                description={t('category.needBased.desc')}
                icon={<Heart className="h-7 w-7" />}
                to="/scholarships?category=need-based"
                count={needBasedCount}
                gradient="bg-gradient-to-br from-primary to-emerald-700"
              />
              <CategoryTile
                title={t('category.merit')}
                description={t('category.merit.desc')}
                icon={<Trophy className="h-7 w-7" />}
                to="/scholarships?category=merit"
                count={meritCount}
                gradient="bg-gradient-to-br from-accent to-orange-600"
              />
              <CategoryTile
                title={t('category.special')}
                description={t('category.special.desc')}
                icon={<Star className="h-7 w-7" />}
                to="/scholarships?category=special"
                count={specialCount}
                gradient="bg-gradient-to-br from-violet-500 to-purple-700"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-28 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight font-display">
                {t('howItWorks.title')}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((item, index) => (
                <div 
                  key={index}
                  className="relative bg-card rounded-2xl p-8 shadow-card text-center border-2 border-border hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 font-display">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="hero-gradient rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
              {/* Pattern overlay */}
              <div className="absolute inset-0 islamic-pattern" />
              <div className="absolute inset-0 network-pattern" />
              
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 end-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute bottom-0 start-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight font-display">
                  {t('cta.title')}
                </h2>
                <p className="text-lg text-white/80 mb-10">
                  {t('cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="xl" 
                    variant="gold"
                    onClick={() => navigate('/register')}
                    className="rounded-xl font-semibold"
                  >
                    {t('cta.button')}
                    <ArrowRight className={`h-5 w-5 ${isUrdu ? 'me-1 rotate-180' : 'ms-1'}`} />
                  </Button>
                  <Button 
                    size="xl" 
                    variant="ghost"
                    className="text-white border-2 border-white/20 hover:bg-white/10 hover:text-white rounded-xl"
                    onClick={() => navigate('/scholarships')}
                  >
                    {t('cta.browseButton')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;