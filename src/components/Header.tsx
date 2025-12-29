import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { LanguageToggle } from '@/components/LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GraduationCap, LogOut, User, Shield, Menu, X, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, isAdmin, profile, logout } = useAuth();
  const { t, isUrdu } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105 shadow-emerald">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className={`text-xl font-bold tracking-tight text-foreground font-display ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'سہولت' : 'Sahulat-e-'}<span className="text-accent">{isUrdu ? ' تعلیم' : 'Taleem'}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/scholarships" 
              className="text-muted-foreground hover:text-primary font-medium transition-colors"
            >
              {t('nav.scholarships')}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-muted-foreground hover:text-primary font-medium transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-muted-foreground hover:text-primary font-medium transition-colors flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                {t('nav.admin')}
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-lg">
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    {isUrdu ? 'میری پروفائل' : 'My Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button onClick={() => navigate('/register')}>
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button
              className="p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-3">
              <Link 
                to="/scholarships" 
                className="px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.scholarships')}
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <Link 
                    to="/profile" 
                    className="px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    {isUrdu ? 'میری پروفائل' : 'My Profile'}
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className="px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  {t('nav.admin')}
                </Link>
              )}
              <div className="border-t border-border my-2" />
              {isAuthenticated ? (
                <button
                  className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-start flex items-center gap-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}