import { useMemo } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { Button } from '@/components/ui/button';
import { useScholarships, getMatchingScholarships, getDaysUntilDeadline } from '@/hooks/use-scholarships';
import { 
  User, 
  MapPin, 
  GraduationCap, 
  Banknote, 
  Target,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Settings,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { profile, isAuthenticated, isLoading } = useAuth();
  const { scholarships, loading: scholarshipsLoading } = useScholarships();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Convert profile to UserProfile format for matching
  const userProfileForMatching = {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    province: profile.province,
    currentDegree: profile.current_degree,
    gpa: profile.gpa,
    familyIncome: profile.family_income,
    isOrphan: profile.is_orphan,
    isZakatEligible: profile.is_zakat_eligible,
  };

  // Get matching scholarships
  const matchingScholarships = useMemo(() => {
    return getMatchingScholarships(scholarships, userProfileForMatching);
  }, [scholarships, profile]);

  // Get urgent deadlines (within 14 days)
  const urgentScholarships = useMemo(() => {
    return matchingScholarships
      .filter(s => getDaysUntilDeadline(s.deadline) <= 14 && getDaysUntilDeadline(s.deadline) > 0)
      .sort((a, b) => getDaysUntilDeadline(a.deadline) - getDaysUntilDeadline(b.deadline));
  }, [matchingScholarships]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Welcome Section */}
        <section className="bg-muted/50 border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 font-display">
                  Welcome back, {profile.full_name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                  You have <span className="text-primary font-semibold">{matchingScholarships.length}</span> scholarships matching your profile
                </p>
              </div>
              
              {/* Profile Summary Card */}
              <div className="bg-card rounded-xl border-2 border-border p-4 shadow-card">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{profile.province}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">GPA: {profile.gpa}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">PKR {profile.family_income.toLocaleString()}/mo</span>
                  </div>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Settings className="h-4 w-4 me-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgent Deadlines Alert */}
        {urgentScholarships.length > 0 && (
          <section className="bg-destructive/5 border-b border-destructive/20 py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p className="font-medium">
                  {urgentScholarships.length} scholarship{urgentScholarships.length > 1 ? 's' : ''} with deadline approaching!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {scholarshipsLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : matchingScholarships.length > 0 ? (
              <>
                {/* Recommended Section */}
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground font-display">Recommended for You</h2>
                      <p className="text-sm text-muted-foreground">Based on your GPA, income, and province</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matchingScholarships.map((scholarship) => (
                      <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* No Matches State */
              <div className="text-center py-16 max-w-md mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-6">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 font-display">
                  No Perfect Matches Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find scholarships that exactly match your current profile. Try browsing all available scholarships or update your profile.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link to="/scholarships">
                      Browse All Scholarships
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/profile">
                      <Settings className="h-4 w-4 me-1" />
                      Update Profile
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Profile Improvement Tips */}
            {matchingScholarships.length > 0 && matchingScholarships.length < 3 && (
              <div className="mt-12 bg-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 font-display">
                      Want More Matches?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You're currently matching with {matchingScholarships.length} scholarships. 
                      Improving your GPA or checking Zakat eligibility could unlock more opportunities.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" asChild>
                        <Link to="/scholarships">View All Scholarships</Link>
                      </Button>
                      <Button variant="gold" asChild>
                        <Link to="/profile">
                          <Settings className="h-4 w-4 me-1" />
                          Update Profile
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;