import { GraduationCap, Heart, ExternalLink, Shield, Award, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';

export function Footer() {
  const { t, isUrdu } = useLanguage();

  const officialLinks = [
    {
      name: isUrdu ? 'ہائر ایجوکیشن کمیشن' : 'Higher Education Commission',
      url: 'https://hec.gov.pk',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      name: isUrdu ? 'وزارت تعلیم' : 'Ministry of Education',
      url: 'https://mofept.gov.pk',
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      name: isUrdu ? 'پنجاب ایجوکیشنل اینڈومنٹ فنڈ' : 'PEEF Punjab',
      url: 'https://peef.org.pk',
      icon: <Award className="h-4 w-4" />,
    },
    {
      name: isUrdu ? 'احسان ٹرسٹ' : 'Ihsan Trust',
      url: 'https://ihsantrust.org',
      icon: <Heart className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="bg-foreground border-t border-border mt-auto">
      {/* Official Portal Banner */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-background/60">
            <Shield className="h-4 w-4 text-accent" />
            <span>{isUrdu ? 'یہ پورٹل پاکستان کے سرکاری اسکالرشپ ڈیٹا کا استعمال کرتا ہے' : 'This portal uses official Pakistani scholarship data sources'}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-background tracking-tight font-display">
                {isUrdu ? 'سہولت' : 'Sahulat-e-'}<span className="text-accent">{isUrdu ? ' تعلیم' : 'Taleem'}</span>
              </span>
            </Link>
            <p className="text-background/60 text-sm max-w-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-background/40 bg-background/5 rounded-lg px-3 py-2">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span>{isUrdu ? 'تصدیق شدہ ڈیٹا' : 'Verified Data Sources'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-5 font-display">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/scholarships" className="text-background/60 hover:text-accent transition-colors">
                  {t('nav.scholarships')}
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-background/60 hover:text-accent transition-colors">
                  {t('footer.createAccount')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-background/60 hover:text-accent transition-colors">
                  {t('footer.signIn')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-background mb-5 font-display">{t('footer.categories')}</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/scholarships?category=international" className="text-background/60 hover:text-accent transition-colors">
                  {t('category.international')}
                </Link>
              </li>
              <li>
                <Link to="/scholarships?category=need-based" className="text-background/60 hover:text-accent transition-colors">
                  {t('category.needBased')}
                </Link>
              </li>
              <li>
                <Link to="/scholarships?category=merit" className="text-background/60 hover:text-accent transition-colors">
                  {t('category.merit')}
                </Link>
              </li>
              <li>
                <Link to="/scholarships?category=special" className="text-background/60 hover:text-accent transition-colors">
                  {t('category.special')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Links */}
          <div>
            <h4 className="font-semibold text-background mb-5 font-display">
              {isUrdu ? 'سرکاری لنکس' : 'Official Links'}
            </h4>
            <ul className="space-y-3 text-sm">
              {officialLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-background/60 hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            {t('footer.copyright')}
          </p>
          <p className="text-sm text-background/50 flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="h-4 w-4 text-accent fill-accent" /> {t('footer.forStudents')}
          </p>
        </div>
      </div>
    </footer>
  );
}