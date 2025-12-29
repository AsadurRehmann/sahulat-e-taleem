import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScholarshipCard } from '@/components/ScholarshipCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useScholarships, Scholarship } from '@/hooks/use-scholarships';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Scholarships = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const { scholarships, loading, error } = useScholarships();

  const filteredScholarships = useMemo(() => {
    return scholarships.filter((scholarship: Scholarship) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          scholarship.title.toLowerCase().includes(query) ||
          scholarship.provider.toLowerCase().includes(query) ||
          scholarship.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (categoryFilter !== 'all') {
        if (categoryFilter === 'international' && !scholarship.isInternational) return false;
        if (categoryFilter !== 'international' && scholarship.category !== categoryFilter) return false;
      }

      // Province filter
      if (provinceFilter !== 'all') {
        if (!scholarship.allowedProvinces.includes(provinceFilter)) return false;
      }

      return true;
    });
  }, [scholarships, searchQuery, categoryFilter, provinceFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setProvinceFilter('all');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || provinceFilter !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/50 border-b border-border py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              All Scholarships
            </h1>
            <p className="text-muted-foreground">
              Browse {scholarships.length} available scholarships from verified providers
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-border bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button 
                variant="outline" 
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>

              {/* Filters (Desktop always visible, Mobile toggleable) */}
              <div className={`flex flex-col sm:flex-row gap-3 ${showFilters ? 'block' : 'hidden md:flex'}`}>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="need-based">Need-Based</SelectItem>
                    <SelectItem value="merit">Merit-Based</SelectItem>
                    <SelectItem value="special">Special Quota</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Province" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Provinces</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Sindh">Sindh</SelectItem>
                    <SelectItem value="Khyber Pakhtunkhwa">KPK</SelectItem>
                    <SelectItem value="Balochistan">Balochistan</SelectItem>
                    <SelectItem value="Gilgit-Baltistan">Gilgit-Baltistan</SelectItem>
                    <SelectItem value="Azad Kashmir">Azad Kashmir</SelectItem>
                    <SelectItem value="Islamabad Capital Territory">Islamabad</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">{error}</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredScholarships.length}</span> scholarships
                  </p>
                </div>

                {/* Scholarship Grid */}
                {filteredScholarships.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScholarships.map((scholarship) => (
                      <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No scholarships found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find more opportunities.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Scholarships;