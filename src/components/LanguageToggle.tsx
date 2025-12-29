import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage, isUrdu } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2 font-medium"
    >
      <Languages className="h-4 w-4" />
      <span className={isUrdu ? 'font-sans' : ''}>
        {isUrdu ? 'English' : 'اردو'}
      </span>
    </Button>
  );
}
