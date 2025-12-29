import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/lib/language-context';

interface CategoryTileProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  count?: number;
  gradient: string;
}

export function CategoryTile({ title, description, icon, to, count, gradient }: CategoryTileProps) {
  const { t } = useLanguage();

  return (
    <Link 
      to={to}
      className={`group relative block p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${gradient}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -end-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
        <div className="absolute -end-8 -bottom-8 h-32 w-32 rounded-full bg-white/10" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm text-white group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          {count !== undefined && (
            <span className="text-white/90 text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {count} {t('category.available')}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 font-display">
          {title}
        </h3>
        <p className="text-white/80 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
