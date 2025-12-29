import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Loader2,
  ExternalLink,
  AlertTriangle,
  CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  deadline: string;
  amount: string;
  official_link: string;
  provider_homepage: string;
  min_gpa: number;
  max_income: number;
  allowed_provinces: string[];
  is_international: boolean;
  is_zakat_eligible: boolean;
  is_orphan_quota: boolean;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Admin = () => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingScholarship, setDeletingScholarship] = useState<Scholarship | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newScholarship, setNewScholarship] = useState({
    title: '',
    provider: '',
    category: 'need-based',
    description: '',
    official_link: '',
    provider_homepage: '',
    amount: '',
    min_gpa: 2.0,
    max_income: 50000,
    deadline: undefined as Date | undefined,
  });

  // Fetch scholarships
  const fetchScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Error fetching scholarships',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setScholarships(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchScholarships();
    }
  }, [isAuthenticated, isAdmin]);

  // Filter scholarships
  const filteredScholarships = scholarships.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit
  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship({ ...scholarship });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingScholarship) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('scholarships')
      .update({
        title: editingScholarship.title,
        description: editingScholarship.description,
        official_link: editingScholarship.official_link,
        provider_homepage: editingScholarship.provider_homepage,
        status: editingScholarship.status,
      })
      .eq('id', editingScholarship.id);
    
    if (error) {
      toast({
        title: 'Error updating scholarship',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Scholarship updated',
        description: `"${editingScholarship.title}" has been updated successfully.`,
      });
      setEditModalOpen(false);
      fetchScholarships();
    }
    setSaving(false);
  };

  // Handle delete
  const handleDeleteClick = (scholarship: Scholarship) => {
    setDeletingScholarship(scholarship);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingScholarship) return;
    
    setDeleting(true);
    const { error } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', deletingScholarship.id);
    
    if (error) {
      toast({
        title: 'Error deleting scholarship',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Scholarship deleted',
        description: `"${deletingScholarship.title}" has been removed.`,
      });
      setDeleteDialogOpen(false);
      fetchScholarships();
    }
    setDeleting(false);
  };

  // Handle create new scholarship
  const handleCreateScholarship = async () => {
    // Validation
    if (!newScholarship.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required.',
        variant: 'destructive',
      });
      return;
    }
    if (!newScholarship.official_link.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Application URL is required.',
        variant: 'destructive',
      });
      return;
    }
    if (!newScholarship.deadline) {
      toast({
        title: 'Validation Error',
        description: 'Deadline is required.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    const { error } = await supabase
      .from('scholarships')
      .insert({
        title: newScholarship.title.trim(),
        provider: newScholarship.provider.trim() || 'Unknown',
        category: newScholarship.category,
        description: newScholarship.description.trim(),
        official_link: newScholarship.official_link.trim(),
        provider_homepage: newScholarship.provider_homepage.trim() || newScholarship.official_link.trim(),
        amount: newScholarship.amount.trim() || 'Varies',
        min_gpa: newScholarship.min_gpa,
        max_income: newScholarship.max_income,
        deadline: format(newScholarship.deadline, 'yyyy-MM-dd'),
        status: 'active',
      });

    if (error) {
      toast({
        title: 'Error creating scholarship',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Scholarship created',
        description: `"${newScholarship.title}" has been added successfully.`,
      });
      setCreateModalOpen(false);
      // Reset form
      setNewScholarship({
        title: '',
        provider: '',
        category: 'need-based',
        description: '',
        official_link: '',
        provider_homepage: '',
        amount: '',
        min_gpa: 2.0,
        max_income: 50000,
        deadline: undefined,
      });
      fetchScholarships();
    }
    setCreating(false);
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'international':
        return 'bg-blue-100 text-blue-800';
      case 'merit':
        return 'bg-accent/20 text-accent-foreground';
      case 'need-based':
        return 'bg-primary/10 text-primary';
      case 'special':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-muted/50 border-b border-border py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage scholarships and fix broken links
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarships Table */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {/* Add New Button */}
            <div className="mb-6">
              <Button 
                onClick={() => setCreateModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Scholarship
              </Button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total: <strong className="text-foreground">{scholarships.length}</strong></span>
                <span>Active: <strong className="text-green-600">{scholarships.filter(s => s.status === 'active').length}</strong></span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredScholarships.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No scholarships found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[250px]">Title</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredScholarships.map((scholarship) => (
                        <TableRow key={scholarship.id}>
                          <TableCell>
                            <div className="font-medium text-foreground">
                              {scholarship.title}
                            </div>
                            <a 
                              href={scholarship.official_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              {scholarship.official_link.slice(0, 40)}...
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {scholarship.provider}
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryBadgeStyle(scholarship.category)}>
                              {scholarship.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(scholarship.status)}>
                              {scholarship.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(scholarship)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteClick(scholarship)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Scholarship</DialogTitle>
            <DialogDescription>
              Update scholarship details and fix broken links
            </DialogDescription>
          </DialogHeader>
          
          {editingScholarship && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingScholarship.title}
                  onChange={(e) => setEditingScholarship({
                    ...editingScholarship,
                    title: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingScholarship.description}
                  onChange={(e) => setEditingScholarship({
                    ...editingScholarship,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-link">Application URL</Label>
                <Input
                  id="edit-link"
                  type="url"
                  value={editingScholarship.official_link}
                  onChange={(e) => setEditingScholarship({
                    ...editingScholarship,
                    official_link: e.target.value
                  })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-homepage">Provider Homepage (Fallback)</Label>
                <Input
                  id="edit-homepage"
                  type="url"
                  value={editingScholarship.provider_homepage}
                  onChange={(e) => setEditingScholarship({
                    ...editingScholarship,
                    provider_homepage: e.target.value
                  })}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingScholarship.status}
                  onValueChange={(value) => setEditingScholarship({
                    ...editingScholarship,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Scholarship
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deletingScholarship?.title}"</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create New Scholarship Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Scholarship
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new scholarship to the database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-title"
                value={newScholarship.title}
                onChange={(e) => setNewScholarship({
                  ...newScholarship,
                  title: e.target.value
                })}
                placeholder="e.g., PEEF Scholarship 2025"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-provider">Organization Name</Label>
              <Input
                id="new-provider"
                value={newScholarship.provider}
                onChange={(e) => setNewScholarship({
                  ...newScholarship,
                  provider: e.target.value
                })}
                placeholder="e.g., Punjab Educational Endowment Fund"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-category">Category</Label>
              <Select
                value={newScholarship.category}
                onValueChange={(value) => setNewScholarship({
                  ...newScholarship,
                  category: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="need-based">Need-based</SelectItem>
                  <SelectItem value="merit">Merit-based</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                  <SelectItem value="special">Provincial/Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea
                id="new-description"
                value={newScholarship.description}
                onChange={(e) => setNewScholarship({
                  ...newScholarship,
                  description: e.target.value
                })}
                placeholder="Brief description of the scholarship..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-link">
                Application URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="new-link"
                type="url"
                value={newScholarship.official_link}
                onChange={(e) => setNewScholarship({
                  ...newScholarship,
                  official_link: e.target.value
                })}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-amount">Scholarship Amount</Label>
              <Input
                id="new-amount"
                value={newScholarship.amount}
                onChange={(e) => setNewScholarship({
                  ...newScholarship,
                  amount: e.target.value
                })}
                placeholder="e.g., Rs. 50,000/year or Full Tuition"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-gpa">Minimum GPA</Label>
                <Input
                  id="new-gpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  value={newScholarship.min_gpa}
                  onChange={(e) => setNewScholarship({
                    ...newScholarship,
                    min_gpa: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-income">Max Income (PKR)</Label>
                <Input
                  id="new-income"
                  type="number"
                  value={newScholarship.max_income}
                  onChange={(e) => setNewScholarship({
                    ...newScholarship,
                    max_income: parseInt(e.target.value) || 0
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                Deadline <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newScholarship.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newScholarship.deadline ? (
                      format(newScholarship.deadline, "PPP")
                    ) : (
                      <span>Pick a deadline</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newScholarship.deadline}
                    onSelect={(date) => setNewScholarship({
                      ...newScholarship,
                      deadline: date
                    })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateScholarship} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scholarship
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;