import { useState } from 'react';
import { Scholarship, getDaysUntilDeadline, isDeadlineUrgent, isDeadlineWarning } from '@/hooks/use-scholarships';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, MapPin, GraduationCap, Banknote, AlertTriangle, Globe, Shield, Heart, Flag, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);
  const { toast } = useToast();
  
  const daysLeft = getDaysUntilDeadline(scholarship.deadline);
  const isUrgent = isDeadlineUrgent(scholarship.deadline);
  const isWarning = isDeadlineWarning(scholarship.deadline);
  const isExpired = daysLeft < 0;

  // Check if officialLink is empty/null - use homepage as fallback
  const hasValidLink = scholarship.officialLink && scholarship.officialLink.trim() !== '';
  const targetUrl = hasValidLink ? scholarship.officialLink : scholarship.providerHomepage;
  const buttonLabel = hasValidLink ? 'Apply Now' : 'Check Official Site';
  const ButtonIcon = hasValidLink ? ExternalLink : Building;

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'international':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'merit':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'need-based':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'special':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowExternalLinkModal(true);
  };

  const handleConfirmRedirect = () => {
    setShowExternalLinkModal(false);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReportBrokenLink = () => {
    // Log for admin verification (in a real app, this would be sent to a backend)
    console.log(`[Broken Link Report] Scholarship: ${scholarship.title} (ID: ${scholarship.id}), URL: ${scholarship.officialLink}, Reported at: ${new Date().toISOString()}`);
    
    toast({
      title: 'Thank you for reporting!',
      description: 'We will verify this link and update it shortly.',
    });
  };

  return (
    <>
      <div className="group bg-card rounded-2xl border-2 border-border shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full">
        {/* Deadline Banner */}
        {!isExpired && (isUrgent || isWarning) && (
          <div className={`px-4 py-2.5 flex items-center gap-2 text-sm font-semibold ${
            isUrgent ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground'
          }`}>
            <AlertTriangle className="h-4 w-4" />
            {isUrgent ? `⚠️ Only ${daysLeft} days left!` : `${daysLeft} days remaining`}
          </div>
        )}
        
        {isExpired && (
          <div className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-medium">
            Application Closed
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          {/* Header with Report Button */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className={`badge-pill ${getCategoryStyles(scholarship.category)}`}>
                  {scholarship.category.replace('-', ' ')}
                </Badge>
                {scholarship.isInternational && (
                  <Badge variant="secondary" className="badge-pill bg-blue-50 text-blue-700 border-blue-200">
                    <Globe className="h-3 w-3 me-1" />
                    International
                  </Badge>
                )}
                {scholarship.isZakatEligible && (
                  <Badge variant="secondary" className="badge-pill bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 me-1" />
                    Zakat Eligible
                  </Badge>
                )}
                {scholarship.isOrphanQuota && (
                  <Badge variant="secondary" className="badge-pill bg-purple-50 text-purple-700 border-purple-200">
                    <Heart className="h-3 w-3 me-1" />
                    Special Quota
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors font-display">
                {scholarship.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">{scholarship.provider}</p>
            </div>
            
            {/* Report Broken Link Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={handleReportBrokenLink}
                  >
                    <Flag className="h-4 w-4" />
                    <span className="sr-only">Report broken link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Report Broken Link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {scholarship.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
            <div className="flex items-start gap-2 text-sm">
              <Banknote className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <span className="text-foreground font-medium">{scholarship.amount}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-accent shrink-0" />
              <span className={`font-medium ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
                {scholarship.deadline.toLocaleDateString('en-PK', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">Min GPA: {scholarship.minGPA}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">
                {scholarship.allowedProvinces.length === 7 
                  ? 'All Provinces' 
                  : scholarship.allowedProvinces.slice(0, 2).join(', ')}
                {scholarship.allowedProvinces.length > 2 && scholarship.allowedProvinces.length < 7 && (
                  <span className="text-xs"> +{scholarship.allowedProvinces.length - 2}</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full mt-auto" 
            variant={isExpired ? 'secondary' : hasValidLink ? 'gold' : 'outline'}
            disabled={isExpired}
            onClick={!isExpired ? handleApplyClick : undefined}
          >
            {isExpired ? (
              <span>Application Closed</span>
            ) : (
              <>
                {buttonLabel}
                <ButtonIcon className="h-4 w-4 ms-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* External Link Confirmation Modal */}
      <AlertDialog open={showExternalLinkModal} onOpenChange={setShowExternalLinkModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              Leaving Sahulat-e-Taleem
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              You are now being redirected to an external portal.
              <br /><br />
              <strong>Note:</strong> You may be required to create a separate account on the provider's official website to apply.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRedirect}>
              Continue to {scholarship.provider}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}