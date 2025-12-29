import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PROVINCES, DEGREES } from '@/lib/scholarships';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  Mail, 
  GraduationCap, 
  MapPin, 
  Wallet, 
  Save,
  Loader2,
  Shield,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const Profile = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading, refreshProfile } = useAuth();
  const { isUrdu } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    province: 'Punjab',
    current_degree: "Bachelor's",
    gpa: 3.0,
    family_income: 30000,
    is_orphan: false,
    is_zakat_eligible: false,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        province: profile.province || 'Punjab',
        current_degree: profile.current_degree || "Bachelor's",
        gpa: profile.gpa || 3.0,
        family_income: profile.family_income || 30000,
        is_orphan: profile.is_orphan || false,
        is_zakat_eligible: profile.is_zakat_eligible || false,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.gpa < 0 || formData.gpa > 4) {
      toast({
        title: isUrdu ? 'غلطی' : 'Validation Error',
        description: isUrdu ? 'GPA 0.0 اور 4.0 کے درمیان ہونا چاہیے' : 'GPA must be between 0.0 and 4.0',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.family_income < 0) {
      toast({
        title: isUrdu ? 'غلطی' : 'Validation Error',
        description: isUrdu ? 'آمدنی مثبت ہونی چاہیے' : 'Income must be a positive number',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.full_name.trim()) {
      toast({
        title: isUrdu ? 'غلطی' : 'Validation Error',
        description: isUrdu ? 'نام درج کریں' : 'Full name is required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          province: formData.province,
          current_degree: formData.current_degree,
          gpa: formData.gpa,
          family_income: formData.family_income,
          is_orphan: formData.is_orphan,
          is_zakat_eligible: formData.is_zakat_eligible,
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: isUrdu ? 'کامیابی!' : 'Success!',
        description: isUrdu ? 'پروفائل اپڈیٹ ہو گئی' : 'Your profile has been updated. Redirecting to dashboard...',
      });
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: isUrdu ? 'غلطی' : 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // First delete the user's profile (this will cascade due to RLS)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user?.id);
      
      if (profileError) throw profileError;
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast({
        title: isUrdu ? 'اکاؤنٹ حذف ہو گیا' : 'Account Deleted',
        description: isUrdu ? 'آپ کا اکاؤنٹ کامیابی سے حذف ہو گیا' : 'Your account and all associated data have been deleted.',
      });
      
      navigate('/');
      
    } catch (error: any) {
      toast({
        title: isUrdu ? 'غلطی' : 'Error',
        description: error.message || 'Failed to delete account',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <User className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display">
              {isUrdu ? 'پروفائل کی ترتیبات' : 'Profile Settings'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isUrdu ? 'اپنی معلومات اپڈیٹ کریں' : 'Update your information to get better scholarship matches'}
            </p>
          </div>

          {/* Profile Form Card */}
          <div className="bg-card rounded-2xl border-2 border-border shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  {isUrdu ? 'ای میل' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  {isUrdu ? 'ای میل تبدیل نہیں ہو سکتی' : 'Email cannot be changed'}
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  {isUrdu ? 'مکمل نام' : 'Full Name'} *
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder={isUrdu ? 'اپنا نام درج کریں' : 'Enter your full name'}
                  required
                />
              </div>

              {/* Province & Degree Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    {isUrdu ? 'صوبہ' : 'Province'}
                  </Label>
                  <Select
                    value={formData.province}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, province: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_degree" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    {isUrdu ? 'موجودہ ڈگری' : 'Current Degree'}
                  </Label>
                  <Select
                    value={formData.current_degree}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, current_degree: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEGREES.map((degree) => (
                        <SelectItem key={degree} value={degree}>
                          {degree}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* GPA & Income Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gpa" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-accent" />
                    {isUrdu ? 'GPA (0.0 - 4.0)' : 'Current GPA (0.0 - 4.0)'}
                  </Label>
                  <Input
                    id="gpa"
                    name="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={formData.gpa}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family_income" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-accent" />
                    {isUrdu ? 'ماہانہ آمدنی (PKR)' : 'Monthly Family Income (PKR)'}
                  </Label>
                  <Input
                    id="family_income"
                    name="family_income"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.family_income}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-accent" />
                  {isUrdu ? 'خصوصی زمرے' : 'Special Categories'}
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <Label htmlFor="is_zakat_eligible" className="font-medium">
                      {isUrdu ? 'زکوۃ کے مستحق' : 'Zakat Eligible'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isUrdu ? 'کیا آپ زکوۃ کے اہل ہیں؟' : 'Are you eligible for Zakat-based scholarships?'}
                    </p>
                  </div>
                  <Switch
                    id="is_zakat_eligible"
                    checked={formData.is_zakat_eligible}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_zakat_eligible: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                  <div>
                    <Label htmlFor="is_orphan" className="font-medium">
                      {isUrdu ? 'یتیم' : 'Orphan Status'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {isUrdu ? 'کیا آپ یتیم ہیں؟' : 'Are you eligible for orphan quota scholarships?'}
                    </p>
                  </div>
                  <Switch
                    id="is_orphan"
                    checked={formData.is_orphan}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_orphan: checked }))}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                variant="gold"
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin me-2" />
                    {isUrdu ? 'محفوظ ہو رہا ہے...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 me-2" />
                    {isUrdu ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-destructive/5 border-2 border-destructive/20 rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-destructive flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              {isUrdu ? 'خطرناک زون' : 'Danger Zone'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isUrdu 
                ? 'یہ عمل ناقابل واپسی ہے۔ آپ کا تمام ڈیٹا مستقل طور پر حذف ہو جائے گا۔'
                : 'Once you delete your account, there is no going back. All your data will be permanently removed.'}
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  {isUrdu ? 'اکاؤنٹ حذف کریں' : 'Delete Account'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {isUrdu ? 'کیا آپ واقعی یقین رکھتے ہیں؟' : 'Are you absolutely sure?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isUrdu 
                      ? 'یہ عمل آپ کا اکاؤنٹ اور تمام متعلقہ ڈیٹا مستقل طور پر حذف کر دے گا۔ یہ عمل واپس نہیں ہو سکتا۔'
                      : 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {isUrdu ? 'منسوخ کریں' : 'Cancel'}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin me-2" />
                        {isUrdu ? 'حذف ہو رہا ہے...' : 'Deleting...'}
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 me-2" />
                        {isUrdu ? 'ہاں، حذف کریں' : 'Yes, delete my account'}
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;